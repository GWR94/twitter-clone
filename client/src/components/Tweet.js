import React from "react";
import PropTypes from "prop-types";

/* 
    TODO
    [ ] Add verified option
*/

const Tweet = (props) => {
    const {handle, tweetText, displayName, taggedUsers, likes, retweets, comments, postedAt, displayImgSrc } = props
    return (
        <div className="tweet--container">
            <div className="tweet--displayImgContainer">
                <img src={displayImgSrc} alt="Display Img" className="tweet--displayImg"/>
            </div>
            <div className="tweet--textContainer">
                <p className="tweet--nameText">{displayName}</p>
                <p className="tweet--handleText">@{handle}-</p>
                <p className="tweet--tweetText">{tweetText}</p>
            </div>
        </div>
    );
}

Tweet.propTypes = {
    displayName: PropTypes.string.isRequired,
    displayImgSrc: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    tweetText: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired
};

export default Tweet;