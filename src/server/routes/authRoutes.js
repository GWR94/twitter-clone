const passport = require("passport");
const bcyrpt = require("bcrypt");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const { Schema } = mongoose;
const Tweets = mongoose.model("tweets");

module.exports = app => {
    app.post(
        "/auth/login",
        passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
        }),
    );

    app.get("/api/current_user", async (req, res) => {
        if (req.user) {
            const tweets = await Tweets.find({ handle: req.user.handle }, (err, tweets) => {
                if (err) return res.send(err);
                return tweets;
            });
            const data = {
                isVerified: req.user.isVerified,
                _id: req.user._id,
                handle: req.user.handle,
                displayName: req.user.displayName || req.user.handle,
                email: req.user.email,
                displayImgSrc: req.user.displayImgSrc,
                headerImgSrc: req.user.headerImgSrc,
                favouritedTweets: req.user.favouritedTweets,
                retweetedTweets: req.user.retweetedTweets,
                followers: req.user.followers,
                following: req.user.following,
                lists: req.user.lists,
                moments: req.user.moments,
                tweets: tweets,
                profileOverview: req.user.profileOverview,
                profileCompleted: req.user.profileCompleted,
            };
            return res.send(data);
        }
        res.send(undefined);
    });

    app.get("/api/get_users", (req, res) => {
        try {
            User.find({}, (err, users) => {
                const usersArr = [];
                users.map(user => {
                    return usersArr.push({
                        displayImgSrc: user.displayImgSrc,
                        headerImgSrc: user.headerImgSrc,
                        followers: user.followers,
                        following: user.following,
                        favouritedTweets: user.favouritedTweets,
                        retweetedTweets: user.retweetedTweets,
                        _id: user._id,
                        displayName: user.displayName,
                        handle: user.handle,
                        email: user.email,
                    });
                });
                res.send(usersArr);
            });
        } catch (e) {
            res.send(e);
        }
    });

    app.post("/api/signup", async (req, res) => {
        try {
            const { handle, email, password } = req.body;
            const existingUser = await User.findOne({ handle: handle });
            if (existingUser) {
                console.log("Invalid credentials. Email/Username already taken");
                return res.status(409).send(false);
            }
            const hash = bcyrpt.hashSync(password, 10);
            const user = await new User({ handle, email, password: hash }).save(); //saving hashed password
            return res.send(user);
        } catch (e) {
            res.status(400).send(e);
        }
    });

    app.get("/api/check_handle/:handle", async (req, res) => {
        const { handle } = req.params;
        await User.findOne(
            {
                handle: handle.toLowerCase(),
            },
            (err, user) => {
                if (user) return res.send(false);
                return res.send(true);
            },
        );
    });

    app.get("/api/check_email/:email", async (req, res) => {
        const { email } = req.params;
        await User.findOne(
            {
                email: email.toLowerCase(),
            },
            (err, user) => {
                if (user) return res.send(false);
                return res.send(true);
            },
        );
    });

    app.post("/api/update_profile", async (req, res) => {
        const { value, field, user } = req.body;
        await User.findOneAndUpdate(
            {
                handle: user,
            },
            {
                $set: { [field]: value },
            },
            (err, user) => {
                if (err) return res.send(err);
                user.save();
                return res.send(user);
            },
        );
    });

    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};
