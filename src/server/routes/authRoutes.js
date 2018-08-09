const passport = require("passport");
const bcyrpt = require("bcrypt");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const {Schema} = mongoose;
 
module.exports = app => {
    app.post("/auth/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }));

    app.get("/api/current_user", (req, res) => {
        if (req.user) {
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
                following: req.user.following
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
                        email: user.email
                    });
                });
                res.send(usersArr);
            })
        } catch (e) {
            res.send(e);
        }
    });

    app.post("/api/signup", async (req, res) => {
        try {
            const {handle, email, password } = req.body;
            console.log(handle, email);
            const existingUser = await User.findOne({handle: handle});
            if (existingUser) {
                console.log("Username already taken");
                return res
                    .status(409)
                    .send("Email already taken");
            }
            const hash = bcyrpt.hashSync(password, 10);
            const user = await new User({handle, email, password: hash}).save(); //saving hashed password
            console.log(user);
            return res.send(user);
        } catch (e) {
            console.log(e);
            res.send(e);
        }
    });

    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};