const request = require('request');
const keys = require('../config/keys');
const axios = require('axios');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = mongoose.model('users');

module.exports = app => {
    app.post('/api/signup', async(req, res) => {
        try {
            const {username, email, password} = req.body;
            const existingUser = await User.findOne({email: email, username: username});
            if (existingUser) {
                return res
                    .status(409)
                    .send('Email already taken');
            }
            const user = await new User({username, email, password}).save();
            return res.send({user});
        } catch (e) {
            res.send(e);
        }
    })
}
