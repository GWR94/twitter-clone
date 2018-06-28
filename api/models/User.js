const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    isVerified: { type: Boolean, default: false },
    password: String,
    profileImg: { data: Buffer, contentType: String },
    headerImg: { data: Buffer, contentType: String }
});

mongoose.model('users', userSchema);