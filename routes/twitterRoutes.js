const Twitter = require("twitter");
const keys = require("../config/keys");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const Tweet = mongoose.model("tweets");

module.exports = (app) => {
    /*
        Connects to twitter API
    */
    const client = new Twitter({consumer_key: keys.consumer_key, consumer_secret: keys.consumer_secret, access_token_key: keys.access_token_key, access_token_secret: keys.access_token_secret});

    /*
        Fetches trends from twitter API based on WOEID from twitterLocations in
        services directory.
    */
    app.get("/api/get_trends/:location", (req, res) => {
        const params = {
            id: req.params.location
        };
        /*
            Connects to twitter API and returns all trends from id parameter WOEID
        */
        client.get("/trends/place", params, function (error, trends) {
            if (error) 
                throw error;
            return res.send(trends[0].trends.slice(0, 10));
        });
    });

    /*
        Retrieves tweet sent from Feed component & saves to Tweets collection,
        and also saves the tweet to the tweets document in the current User's
        collection.
    */
    app.post("/api/tweet", async(req, res) => {
        const {tweet, handle, postedAt } = req.body;
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
        await User.findOne({
            handle: handle
        }, async function (err, user) {
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
                displayName: user.displayName
            }).save();
            res.send(latestTweet);
        }).catch((err) => {
            res.send(err);
        });
    });

    /*
        The fetchTweets function is executed from the componentDidMount function on
        from the Feed component/after a tweet is created by the user. This route fetches 
        tweets only from the username parameter which is set in req.body from the client.
    */
    app.get("/api/fetch_tweets/:handle", async(req, res) => {
        const {handle} = req.params;
        await Tweet.find({
            handle: handle
        }, (err, tweets) => {
            if (err) {
                return res
                    .status(400)
                    .send(null);
            }
            /*
                Send all tweets back to the client, or send any errors if there are any present.
            */
            return res.send(tweets);
        }).catch(err => {
            res
                .status(400)
                .send(err);
        });
    });

    /*
        The updateTweet function is executed from the Tweet component, which is used to
        update the values from a previously sent tweet. It is normally used to update a
        like or retweet from a user.
    */
    app.patch("/api/update_tweet", async(req, res) => {
        try {

            const {tweetID, action, user} = req.body;
            /*
                Find current tweet from the Tweet schema by using the tweets _id value, 
                which is passed through from req.body.
            */
            await Tweet.findOne({
                _id: tweetID
            }, async (err, tweet) => {
                if(err) res.status(400).send(err);
                /*
                    Switch the action set in req.body to determine which document to update
                */
                switch(action) {
                case "retweet":
                    if(tweet.retweets.users.indexOf(user) === -1) {
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
                        await User.findOne({
                            handle: user
                        }, (err, user) => {
                            const retweetsArr = user.retweetedTweets;
                            retweetsArr.push(tweetID);
                            user.retweetedTweets = retweetsArr;
                            user.save();
                        });
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
                        await User.findOne({
                            handle: user
                        }, (err, user) => {
                            const retweetsArr = user.retweetedTweets;
                            const index = retweetsArr.indexOf(tweetID);
                            retweetsArr.splice(index, 1);
                            user.retweetedTweets = retweetsArr;
                            user.save();
                        });
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
                    if(tweet.likes.users.indexOf(user) === -1) {
                        let amount = tweet.likes.amount + 1;
                        tweet.likes.amount = amount;
                        console.log(tweet.likes.amount);
                        let users = tweet.likes.users;
                        users.push(user);
                        tweet.likes.users = user;
                        await User.findOne({
                            handle: user
                        }, (err, user) => {
                            const favouritedArr = user.favouritedTweets;
                            favouritedArr.push(tweetID);
                            user.favouritedTweets = favouritedArr;
                            user.save();
                        });
                    } else {
                        let amount = tweet.likes.amount - 1;
                        tweet.likes.amount = amount;
                        let users = tweet.likes.users;
                        const index = tweet.likes.users.indexOf(user);
                        users.splice(index, 1);
                        tweet.likes.users = users;
                        await User.findOne({
                            handle: user
                        }, (err, user) => {
                            const favouritedArr = user.favouritedTweets;
                            const index = favouritedArr.indexOf(tweetID);
                            favouritedArr.splice(index, 1);
                            user.favouritedTweets = favouritedArr;
                            user.save();
                        });
                    }
                    tweet.save();
                    res.send(tweet);
                    break;
                }
            }, {new: true});
        } catch (err) {
            console.log(err);
            res
                .status(400)
                .send(err);
        }
    });

    app.post("/api/follow_user", async (req,res) => {
        const { action, handle, currentUser } = req.body;
        await User.findOne({
            handle: currentUser,
        }, async (err, user) => {
            await User.findOne({
                handle: user
            }, (e, foundUser) => {
                if(foundUser) {
                    const followers = user.followers;
                    if(action === "follow") {
                        followers.push(handle);
                    } else {
                        const index = followers.indexOf(handle);
                        followers.splice(index, 1);
                    }
                    user.followers = followers;
                    user.save();
                    return res.send(user);
                }
                return res.status(400).send(e);
                
            });
            if(err) return res.status(400).send(err);
        });
    });
};
