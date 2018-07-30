const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const passport = require('passport');
const session = require('express-session');
const cookieSession = require('cookie-session');
const path = require('path');

require('./models/User');
require('./config/passport');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI);

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}));

app.use(passport.initialize());
app.use(passport.session());

require('./routes/verifyRoutes')(app);
require('./routes/authRoutes')(app);
require('./routes/databaseRoutes')(app);
require('./routes/twitterRoutes')(app);

if (process.env.NODE_ENV === 'production') {
    const publicPath = path.join(__dirname, "./client", "public");
    app.use(express.static(publicPath));

    // Express will serve up the index.html file if it doesn't recognize the route
    app.get('*', (req, res) => {
        res.sendFile(path.join(publicPath, "index.html"));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is up at port ${port}`);
});
