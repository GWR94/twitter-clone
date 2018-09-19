const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    handle: {
        type: String,
        unique: true,
    },
    displayName: String,
    email: {
        type: String,
        unique: true,
    },
    displayImg: {
        type: String,
        default: null
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    password: String,
    displayImgSrc: {
        type: String,
        default: null,
    },
    headerImgSrc: {
        type: String,
        default: null,
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    favouritedTweets: {
        type: Array,
        default: [],
    },
    retweetedTweets: {
        type: Array,
        default: [],
    },
    lists: {
        type: Array,
        default: [],
    },
    moments: {
        type: Array,
        default: [],
    },
    profileOverview: {
        type: String,
        default: null,
    },
    profileCompleted: {
        type: Boolean,
        default: false,
    },
    birthday: {
        type: Object,
    },
    birthPlace: {
        type: String,
    },
    dateCreated: {
        type: Date,
    },
    location: {
        type: Object
    },
    website: {
        type: String
    },
    themeColor: {
        type: String,
        default: "#1DA1F2"
    }
});

mongoose.model("users", userSchema);
