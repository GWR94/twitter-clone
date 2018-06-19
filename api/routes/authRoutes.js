const passport = require('passport');

module.exports = app => {
    app.post('/auth/login', passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/',
    }));

    app.get('/api/current_user', (req, res) => {
        const data = {
            isVerified: req.user.isVerified,
            _id: req.user._id,
            username: req.user.username,
            email: req.user.email,
            photo: req.user.photo || 'https://muraltown.com/wp-content/uploads/Headshot-Placeholder-male.png'
        }
        res.send(data);
    });

    app.get('/api/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    })
}