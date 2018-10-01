const passport = require("passport");
const bcyrpt = require("bcrypt");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const { Schema } = mongoose;
const Tweets = mongoose.model("tweets");
const moment = require("moment");

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
                birthday: req.user.birthday,
                birthPlace: req.user.birthPlace,
                dateCreated: moment(req.user.dateCreated).format("MMMM YYYY"),
                themeColor: req.user.themeColor,
                location: req.user.location,
                website: req.user.location,
                displayImg: req.user.displayImg,
                headerImg: req.user.headerImg,
                pinnedTweet: req.user.pinnedTweet,
            };
            return res.send(data);
        }
        res.send(undefined);
    });

    app.get("/api/get_user/:handle", async (req, res) => {
        const { handle } = req.params;
        const tweets = await Tweets.find({ handle }, (err, tweets) => {
            if (err) return res.send(err);
            return tweets;
        });
        User.findOne(
            {
                handle,
            },
            (err, user) => {
                if (err) return res.json({ error: err });
                const userData = {
                    isVerified: user.isVerified,
                    handle: user.handle,
                    displayName: user.displayName || user.handle,
                    email: user.email,
                    displayImgSrc: user.displayImgSrc,
                    headerImgSrc: user.headerImgSrc,
                    favouritedTweets: user.favouritedTweets,
                    retweetedTweets: user.retweetedTweets,
                    followers: user.followers,
                    following: user.following,
                    lists: user.lists || [],
                    moments: user.moments || [],
                    tweets: tweets,
                    profileOverview: user.profileOverview || "",
                    birthday: user.birthday || "",
                    birthPlace: user.birthPlace || "",
                    dateCreated: moment(user.dateCreated).format("MMMM YYYY"),
                    themeColor: user.themeColor || "",
                    location: user.location || "",
                    website: user.location || "",
                    displayImg: user.displayImg,
                    headerImg: user.headerImg,
                    pinnedTweet: user.pinnedTweet,
                    profileCompleted: user.profileCompleted,
                };
                return res.send(userData);
            },
        );
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
            const { handle, email, password, dateCreated } = req.body;
            const existingUser = await User.findOne({ handle: handle });
            if (existingUser) {
                console.log("Invalid credentials. Email/Username already taken");
                return res.status(409).send(false);
            }
            const hash = bcyrpt.hashSync(password, 10);
            const user = await new User({ handle, email, password: hash, dateCreated }).save(); //saving hashed password
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

        const tweets = await Tweets.find({ handle: req.user.handle }, (err, tweets) => {
            if (err) return res.send(err);
            return tweets;
        });

        await User.findOneAndUpdate(
            {
                handle: user,
            },
            {
                $set: { [field]: value },
            },
            (err, user) => {
                if (err) return res.send(err);
                const userData = {
                    isVerified: user.isVerified,
                    handle: user.handle,
                    displayName: user.displayName || user.handle,
                    email: user.email,
                    displayImgSrc: user.displayImgSrc,
                    headerImgSrc: user.headerImgSrc,
                    favouritedTweets: user.favouritedTweets,
                    retweetedTweets: user.retweetedTweets,
                    followers: user.followers,
                    following: user.following,
                    lists: user.lists || [],
                    moments: user.moments || [],
                    tweets: tweets,
                    profileOverview: user.profileOverview || "",
                    birthday: user.birthday || "",
                    birthPlace: user.birthPlace || "",
                    dateCreated: moment(user.dateCreated).format("MMMM YYYY"),
                    themeColor: user.themeColor || "",
                    location: user.location || "",
                    website: user.location || "",
                    displayImg: user.displayImg,
                    headerImg: user.headerImg,
                    pinnedTweet: user.pinnedTweet,
                    profileCompleted: user.profileCompleted,
                };
                user.save();
                return res.send(userData);
            },
        );
    });

    app.post("/api/follow_user", async (req, res) => {
        const { action, currentUser, userToFollow } = req.body;

        const tweets = await Tweets.find({ handle: req.user.handle }, (err, tweets) => {
            if (err) return res.send(err);
            return tweets;
        });

        await User.findOne(
            {
                handle: currentUser,
            },
            async (err, user) => {
                if (err) return res.status(404).send(err);
                const following = user.following;
                if (action === "follow") {
                    if (following.indexOf(userToFollow) > -1) {
                        console.log(`${currentUser} is already following ${userToFollow}`);
                        return res.status(400).send({ error: "Already following user" });
                    }
                    following.push(userToFollow);
                } else {
                    const index = following.indexOf(userToFollow);
                    following.splice(index, 1);
                }
                user.following = following;
                user.save();
                const userData = {
                    isVerified: user.isVerified,
                    handle: user.handle,
                    displayName: user.displayName || user.handle,
                    email: user.email,
                    displayImgSrc: user.displayImgSrc,
                    headerImgSrc: user.headerImgSrc,
                    favouritedTweets: user.favouritedTweets,
                    retweetedTweets: user.retweetedTweets,
                    followers: user.followers,
                    following: user.following,
                    lists: user.lists || [],
                    moments: user.moments || [],
                    tweets: tweets,
                    profileOverview: user.profileOverview || "",
                    birthday: user.birthday || "",
                    birthPlace: user.birthPlace || "",
                    dateCreated: moment(user.dateCreated).format("MMMM YYYY"),
                    themeColor: user.themeColor || "",
                    location: user.location || "",
                    website: user.location || "",
                    displayImg: user.displayImg,
                    headerImg: user.headerImg,
                    pinnedTweet: user.pinnedTweet,
                    profileCompleted: user.profileCompleted,
                };
                await User.findOne(
                    {
                        handle: userToFollow,
                    },
                    async (err, foundUser) => {
                        if (err) return res.status(404).send(err);
                        const followers = foundUser.followers;
                        if (action === "follow") {
                            followers.push(currentUser);
                        } else {
                            const index = followers.indexOf(currentUser);
                            followers.splice(index, 1);
                        }
                        foundUser.followers = followers;
                        return foundUser.save();
                    },
                );
                res.send(userData);
            },
        );
    });

    app.post("/api/pin_tweet", async (req, res) => {
        const { handle, tweetID } = req.body;

        await User.findOne(
            {
                handle: handle,
            },
            async (err, user) => {
                if (err) return res.status(400).send(err);
                if (user.pinnedTweet === tweetID) {
                    user.pinnedTweet = null;
                } else {
                    user.pinnedTweet = tweetID;
                }
                user.save();

                const tweets = await Tweets.find({ handle: handle }, (err, tweets) => {
                    if (err) return res.send(err);
                    return tweets;
                });

                const userData = {
                    _id: user._id,
                    isVerified: user.isVerified,
                    handle: user.handle,
                    displayName: user.displayName || user.handle,
                    email: user.email,
                    displayImgSrc: user.displayImgSrc,
                    headerImgSrc: user.headerImgSrc,
                    favouritedTweets: user.favouritedTweets,
                    retweetedTweets: user.retweetedTweets,
                    followers: user.followers,
                    following: user.following,
                    lists: user.lists || [],
                    moments: user.moments || [],
                    tweets: tweets,
                    profileOverview: user.profileOverview || "",
                    birthday: user.birthday || "",
                    birthPlace: user.birthPlace || "",
                    dateCreated: moment(user.dateCreated).format("MMMM YYYY"),
                    themeColor: user.themeColor || "",
                    location: user.location || "",
                    website: user.location || "",
                    displayImg: user.displayImg,
                    headerImg: user.headerImg,
                    pinnedTweet: user.pinnedTweet,
                    profileCompleted: user.profileCompleted,
                };
                console.log(userData);
                res.send(userData);
            },
        );
    });

    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};
