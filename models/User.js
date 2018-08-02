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
        default: "https://pbs.twimg.com/media/C8SFjSYWAAA6452.jpg:large"
    },
    headerImgSrc: {
        type: String,
        default: "http://www.tweetbrander.com/wp-content/uploads/2013/01/twitter-header-post-640x3" +
                "60.png"
    },
    tweets: {
        type: Array,
        default: []
    }
});

mongoose.model("users", userSchema);