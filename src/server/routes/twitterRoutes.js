const Twitter = require("twitter");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Tweet = mongoose.model("tweets");
const fs = require("fs");
const path = require("path");
const cyrpto = require("crypto");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");

module.exports = app => {
    /*
        Connects to twitter API
    */
    const client = new Twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret,
    });

    /*
        Fetches trends from twitter API based on WOEID from twitterLocations in
        services directory.
    */
    app.get("/api/get_trends/:location", async (req, res) => {
        const params = {
            id: req.params.location,
        };
        /*
            Connects to twitter API and returns all trends from id parameter WOEID
        */
        await client.get("/trends/place", params, function(error, trends) {
            if (error) {
                console.log(error);
                return res.json(error);
            }
            return res.send(trends[0].trends.slice(0, 10));
        });
    });

    /*
        Retrieves tweet sent from Feed component & saves to Tweets collection,
        and also saves the tweet to the tweets document in the current User's
        collection.
    */
    app.post("/api/tweet", async (req, res) => {
        const { tweet, handle, postedAt } = req.body;
        /*
            taggedUsers returns all usernames which are mentioned inside the
            tweet which are between 1 and 15 characters long, where all preceding
            and following characters are not illegal characters (i.e symbols).

        */
        const taggedUsers = tweet.match(/(?<!\S)(@{1}[\w]{1,15}\b)(?=\s)/g);
        /*
            Search User Schema for username (twitter handle) which was sent
            from req.body
        */
        await User.findOne(
            {
                handle: handle,
            },
            async function(err, user) {
                if (err) {
                    return res.send(err);
                }
                /*
                If the username sent in req.body matches a username in the
                database, create a new Tweet by using the Tweet Schema with all
                the relevant values, and save it to the database with save().
            */
                const latestTweet = await new Tweet({
                    tweetText: tweet,
                    taggedUsers: taggedUsers,
                    handle,
                    displayImgSrc: user.displayImgSrc,
                    postedAt: postedAt,
                    isVerified: user.isVerified,
                    email: user.email,
                    displayName: user.displayName,
                }).save();
                res.send(latestTweet);
            },
        ).catch(err => {
            res.send(err);
        });
    });

    /*
        The fetchTweets function is executed from the componentDidMount function on
        from the Feed component/after a tweet is created by the user. This route fetches 
        tweets only from the username parameter which is set in req.body from the client.
    */
    app.get("/api/fetch_tweets/:handle", async (req, res) => {
        const { handle } = req.params;
        /*
            The handle is received from the req.params, which is the handle which will be used to
            determine which tweets are going to be loaded from the database via the users' following
            array document.
        */
        const userDetails = await User.findOne(
            {
                handle: handle,
            },
            async (err, user) => {
                /*
                    If any errors are caught, send them to the client with a 400 status code.
                */
                if (err) {
                    return res.status(400).send(null);
                }
                /*
                    If a user is found, the user.following array is transferred to the following const,
                    so it can be manipulated. The tweetsArr array is initialised to contain all of the tweets
                    which will be pushed to it. 
                */
                return user;
            },
        );
        const following = userDetails.following;
        const tweetsArr = [];

        await Tweet.find(
            {
                handle: handle,
            },
            (err, tweets) => {
                if (err) return res.send(err);
                tweets.forEach(tweet => {
                    tweetsArr.push(tweet);
                });
            },
        );
        /*
                        If there is only one item in the following array, then the first (and only) user
                        needs to be found, and all tweets from that user need to be looped through, and 
                        pushed to the tweetsArr array.
                */
        if (following.length === 1) {
            await Tweet.find(
                {
                    handle: following[0],
                },
                (err, tweets) => {
                    if (err) return res.status(400).send(err);
                    tweets.forEach(tweet => {
                        tweetsArr.push(tweet);
                    });
                },
            );
        } else {
            for (let follower of following) {
                await Tweet.find(
                    {
                        handle: follower,
                    },
                    (err, tweets) => {
                        if (err) return res.status(400).send(err);
                        tweets.forEach(tweet => {
                            tweetsArr.push(tweet);
                        });
                    },
                );
            }
        }
        return res.send(tweetsArr);
    });

    /*
        The updateTweet function is executed from the Tweet component, which is used to
        update the values from a previously sent tweet. It is normally used to update a
        like or retweet from a user.
    */
    app.patch("/api/update_tweet", async (req, res) => {
        try {
            const { tweetID, action, user } = req.body;
            /*
                Find current tweet from the Tweet schema by using the tweets _id value, 
                which is passed through from req.body.
            */
            await Tweet.findOne(
                {
                    _id: tweetID,
                },
                async (err, tweet) => {
                    if (err) res.status(400).send(err);
                    /*
                        Switch the action set in req.body to determine which document to update
                    */
                    switch (action) {
                        case "retweet":
                            if (tweet.retweets.users.indexOf(user) === -1) {
                                /*
                                If the retweets.users array doesn't contain the user value sent from
                                req.body, then the client is trying to retweet something. The retweets.amount 
                                value should be incremented by 1, and the user value from req.body should be pushed 
                                into the retweets.users array.  
                            */
                                let amount = tweet.retweets.amount + 1;
                                tweet.retweets.amount = amount;
                                let users = tweet.retweets.users;
                                users.push(user);
                                tweet.retweets.users = users;
                                /*
                                The current user then needs to have a reference to the
                                retweeted tweet, so the current user is found by using
                                the findOne function, then the tweetID (from req.body)
                                is pushed into the retweetedTweets.
                            */
                                await User.findOne(
                                    {
                                        handle: user,
                                    },
                                    (err, user) => {
                                        const retweetsArr = user.retweetedTweets;
                                        retweetsArr.push(tweetID);
                                        user.retweetedTweets = retweetsArr;
                                        user.save();
                                    },
                                );
                            } else {
                                /*
                                If the user value from req.body is already in the tweet.retweets.users array, then the
                                client is trying to undo a retweet. This means that the amount should be decremented by 1,
                                and the user value should be removed from the tweets retweets.users array.
                            */
                                let amount = tweet.retweets.amount - 1;
                                tweet.retweets.amount = amount;
                                let users = tweet.retweets.users;
                                const index = tweet.retweets.users.indexOf(user);
                                users.splice(index, 1);
                                tweet.retweets.users = users;
                                /*
                                Once the tweet is un-retweeted, it must then be removed from the current
                                users' retweetedTweets array. This is done by finding the user from the 
                                users collection by the findOne function. It is then removed by finding 
                                the index, and removing it from the array using splice().
                            */
                                await User.findOne(
                                    {
                                        handle: user,
                                    },
                                    (err, user) => {
                                        const retweetsArr = user.retweetedTweets;
                                        const index = retweetsArr.indexOf(tweetID);
                                        retweetsArr.splice(index, 1);
                                        user.retweetedTweets = retweetsArr;
                                        user.save();
                                    },
                                );
                            }
                            /*
                            Save the tweet to the Tweets collection, and send it back to the client.  
                        */
                            tweet.save();
                            res.send(tweet);
                            break;
                        /*
                        Use the same methods as 'retweet' for the 'like' action.
                    */
                        case "like":
                            /*
                            If the action is "like", then the tweet is checked to see if the user has
                            already liked by trying to find the index. If it is not found, then the like
                            count is incremented by one, and the user is pushed into the likes user array,
                            and saved.
                        */
                            if (tweet.likes.users.indexOf(user) === -1) {
                                let amount = tweet.likes.amount + 1;
                                tweet.likes.amount = amount;
                                let users = tweet.likes.users;
                                users.push(user);
                                tweet.likes.users = user;
                                /*
                                The current users' document is updated to push the tweets _id to the 
                                favouritedTweets field array. The user document is then saved.
                            */
                                await User.findOne(
                                    {
                                        handle: user,
                                    },
                                    (err, user) => {
                                        const favouritedArr = user.favouritedTweets;
                                        favouritedArr.push(tweetID);
                                        user.favouritedTweets = favouritedArr;
                                        user.save();
                                    },
                                );
                            } else {
                                /*
                                If there is no index found in the search for the user in the tweets' likes array,
                                then the user must be trying to remove a like. The tweet.likes amount number needs
                                to be decreased by 1, so the tweet.likes.amount is stored into the const amount, and
                                decreased by one. It is then converted to the tweets.likes.amount document.
                            */
                                let amount = tweet.likes.amount - 1;
                                tweet.likes.amount = amount;
                                /*
                                Firstly, the tweet.likes.users array is stored into the const users so it can be 
                                manipulated. The index of the user is then found so it can be removed; then the array 
                                is spliced with the parameters of the index to remove, and the number of items to remove (1).
                                The tweet.likes.users array is then converted to the updated users array.
                            */
                                let users = tweet.likes.users;
                                const index = tweet.likes.users.indexOf(user);
                                users.splice(index, 1);
                                tweet.likes.users = users;
                                /*
                                The current user is found in the User collection, and the user.favouritedTweets array is spliced
                                to remove the user from the array, using the same methods as above. The user is then saved.
                            */
                                await User.findOne(
                                    {
                                        handle: user,
                                    },
                                    (err, user) => {
                                        if (err) return res.status(400).send(err);
                                        const favouritedArr = user.favouritedTweets;
                                        const index = favouritedArr.indexOf(tweetID);
                                        favouritedArr.splice(index, 1);
                                        user.favouritedTweets = favouritedArr;
                                        user.save();
                                    },
                                );
                            }
                            /*
                            The tweet is saved to update all the values, and the tweet is then sent back to
                            the client.
                        */
                            tweet.save();
                            res.send(tweet);
                            break;
                    }
                },
                /*
                    The new document is the one being sent to the client with { new: true }
                */

                { new: true },
            );
            /*
                Catching any errors, and sending them back to the client with a 400 (bad request) status code.
            */
        } catch (err) {
            res.status(400).send(err);
        }
    });

    app.delete("/api/delete_tweet/:tweetID", async (req, res) => {
        try {
            /*
                The tweetID is received from the req.params, and the findOneByIdAndRemove function finds this
                ID in the Tweet collection, and removes the whole tweet.
            */
            const { tweetID } = req.params;
            await Tweet.findByIdAndRemove(tweetID);
        } catch (e) {
            /*
                If there are any errors, send it back to the client.
            */
            res.json({ error: e });
        }
    });
};
