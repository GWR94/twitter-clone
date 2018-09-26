const mongoose = require("mongoose");
const { Schema } = mongoose;

const tweetSchema = new Schema({
    tweetText: {
        type: String,
        required: true,
    },
    taggedUsers: {
        type: String,
        default: [],
    },
    handle: {
        type: String,
        required: true,
    },
    displayImgSrc: {
        type: String,
    },
    likes: {
        amount: {
            type: Number,
            default: 0,
        },
        users: {
            type: Array,
            default: [],
        },
    },
    retweets: {
        amount: {
            type: Number,
            default: 0,
        },
        users: {
            type: Array,
            default: [],
        },
    },
    comments: {
        type: Array,
        default: [],
    },
    postedAt: {
        type: Date,
        required: true,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    email: String,
    displayName: String,
    photos: {
        type: Buffer,
        contentType: String,
    },
    pinnedTweet: {
        type: Boolean,
        default: false
    }
});

mongoose.model("tweets", tweetSchema);
