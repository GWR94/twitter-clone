const mongoose = require('mongoose');
const {Schema} = mongoose;

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
        required: true,
    },
    likes: {
        type: Number,
        default: 0,
    },
    retweets: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array,
        default: [],
    },
    postedAt: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email: {
        
    }
});

mongoose.model('tweets', tweetSchema);