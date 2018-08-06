const passport = require("passport");

module.exports = app => {
    // : Authenticates using local passport
    app.post("/auth/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }));

    // : Returns all relevant user data if user is logged in, else returns undefined
    app.get("/api/current_user", (req, res) => {
        if (req.user) {
            const data = {
                isVerified: req.user.isVerified,
                _id: req.user._id,
                handle: req.user.handle,
                displayName: req.user.displayName,
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

    // : Logs the user out
    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};