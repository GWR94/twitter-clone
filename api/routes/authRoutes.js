const passport = require('passport');

module.exports = app => {
    app.post('/auth/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/'
    }));

    app.get('/api/current_user', (req, res) => {
        if (req.user) {
            const data = {
                isVerified: req.user.isVerified,
                _id: req.user._id,
                username: req.user.username,
                email: req.user.email,
                profileImg: req.user.profileImg || 'https://muraltown.com/wp-content/uploads/Headshot-Placeholder-male.png',
                headerImg: req.user.headerImg || null
            }
            return res.send(data);
        }
        res.send();
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
}