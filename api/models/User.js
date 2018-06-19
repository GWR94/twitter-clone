const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    password: String,
});

mongoose.model('users', userSchema);