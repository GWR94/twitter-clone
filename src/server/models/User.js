const mongoose = require("mongoose");
const {Schema} = mongoose;

const userSchema = new Schema({
    handle: {
        type: String,
        unique: true
    },
    displayName: String,
    email: {
        type: String,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    password: String,
    displayImgSrc: {
        type: String,
        default: null
    },
    headerImgSrc: {
        type: String,
        default: null,
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    favouritedTweets: {
        type: Array,
        default: []
    },
    retweetedTweets: {
        type: Array,
        default: []
    }

});

mongoose.model("users", userSchema);