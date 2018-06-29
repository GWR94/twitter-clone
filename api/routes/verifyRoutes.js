const request = require('request');
const keys = require('../config/keys');
const axios = require('axios');
const mongoose = require('mongoose');
const User = mongoose.model('users');
const bcyrpt = require('bcrypt');

module.exports = app => {
    app.post('/api/signup', async(req, res) => {
        try {
            const {username, email, password } = req.body;
            const existingUser = await User.findOne({username: username});
            if (existingUser) {
                return res
                    .status(409)
                    .send('Email already taken');
            }
            const hash = bcyrpt.hashSync(password, 10);
            const user = await new User({username, email, password: hash}).save(); //saving hashed password
            return res.send({user});
        } catch (e) {
            res.send(e);
        }
    })
}
