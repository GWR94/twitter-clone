const passport = require("passport");

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
                displayName: req.user.displayName,
                email: req.user.email,
                displayImgSrc: req.user.displayImgSrc,
                headerImgSrc: req.user.headerImgSrc,
                tweets: req.user.tweets
            };
            return res.send(data);
        }
        res.send(undefined);
    });

    app.get("/api/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
};