const Twitter = require("twitter");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Tweet = mongoose.model("tweets");

module.exports = (app) => {
    const client = new Twitter({consumer_key: keys.consumer_key, consumer_secret: keys.consumer_secret, access_token_key: keys.access_token_key, access_token_secret: keys.access_token_secret});

    app.get("/api/get_trends/:location", (req, res) => {
        const params = {
            id: req.params.location
        };
        client.get("/trends/place", params, function (error, trends) {
            if (error) 
                throw error;
            return res.send(trends[0].trends);
        });
    });

    app.post("/api/tweet", async(req, res) => {
        const {tweet, username} = req.body;
        const taggedUsers = tweet.match(/\B@{1}[\w]{1,}/g);
        let currentTweet;
        await User.findOne({
            handle: username,
        }, async function (err, user) {
            currentTweet = await new Tweet({
                tweetText: tweet,
                taggedUsers: taggedUsers,
                handle: username,
                displayImgSrc: user.displayImgSrc,
                postedAt: Date.now(),
                isVerified: user.isVerified,
                email: user.email
            }).save();
            if (err) 
                res.send(err);
            const setTweets = user["tweets"] || [];
            setTweets.push(currentTweet);
            user.tweets = setTweets;
            user.save();
            res.send(currentTweet);
        }).catch((err) => {
            res.send(err);
        });
    });

    app.get("/api/fetch_tweets/:username", async(req, res) => {
        const username = req.params.username;
        try {
            await User.findOne({
                handle: username
            }, async(err, user) => {
                try {
                    return res.send(user.tweets);
                } catch(e) {
                    return res.send(null);
                } 
            });
        } catch (e) {
            return res.send(e);
        }
    });
};
