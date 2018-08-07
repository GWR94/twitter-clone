import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "reactstrap";
import timeago from "timeago.js"
import TimeAgo from "timeago-react";
import {connect} from "react-redux";
import * as actions from "../actions";
import verifiedIcon from "../../../../public/images/twitterVerified.png";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";
import twitterLocale from "../services/twitterLocale";


/*
    TODO
    [x] Add verified option
    [ ] Add dot between time ago & handle
    [ ] Add tooltips for interactions
*/

class Tweet extends React.Component {
    constructor() {
        super();
        this.state = {
        }
    }

    render() {
        const {
            _id,
            handle,
            tweetText,
            displayName,
            displayImgSrc,
            isVerified,
            updateTweet,
            auth,
            likes,
            retweets,
            comments,
            postedAt
        } = this.props

        timeago.register("twitter", twitterLocale);

        return (
            <div className="tweet--container">
                <div className="tweet--displayImgContainer">
                    <img src={displayImgSrc || defaultDisplayImg} alt="Display Img" className="tweet--displayImg"/>
                </div>
                <div className="tweet--textContainer">
                    <div className="tweet--nameTextContainer">
                        {displayName && <p className="tweet--nameText">{displayName}</p>}
                        {isVerified && <img alt="Verified Profile" src={verifiedIcon} className="tweet--verifiedIcon"/>}
                        <p className="tweet--handleText">@{handle} · <TimeAgo datetime={postedAt} locale="twitter" /></p>
                    </div>
                    <div className="tweet--tweetContainer">
                        <p className="tweet--tweetText">{tweetText}</p>
                    </div>
                    <div className="tweet--interactionsContainer">
                        <div className="tweet--comment">
                            <i className="far fa-comment tweet--interaction"/> 
                            {
                                comments.length > 0 && (
                                <span className="tweet--interactionText">
                                    {comments.length}
                                </span>
                                )
                            }
                        </div>
                        <div 
                            className={retweets
                                .users
                                .indexOf(auth.handle) > -1
                                ? "tweet--userRetweet"
                                : "tweet--retweet"}
                            onClick={async () => {
                                await updateTweet({tweetID: _id, action: "retweet", user: auth.handle});
                            }}>
                            <i className="fas fa-retweet tweet--interaction" />
                            {
                                retweets.amount > 0 && (
                                <span className="tweet--interactionText">
                                    {retweets.amount}
                                </span>
                                )
                            }
                        </div>
                        <div
                            className={likes
                            .users
                            .indexOf(auth.handle) > -1
                            ? "tweet--userLiked"
                            : "tweet--like"}>
                            <i 
                                className="far fa-heart tweet--interaction" 
                                onClick={async() => {
                                    await updateTweet({tweetID: _id, action: "like", user: auth.handle});
                                }}/>{likes.amount > 0 && 
                                <span className="tweet--interactionText">
                                    {likes.amount}
                                </span>
                                }
                        </div>
                        <div className="tweet--message"><i className="far fa-envelope tweet--interaction"/></div>
                    </div>
                </div>
            </div>
        );
    }
}
Tweet.propTypes = {
    displayName: PropTypes.string,
    displayImgSrc: PropTypes.string.isRequired,
    handle: PropTypes.string.isRequired,
    tweetText: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
    postedAt: PropTypes.string.isRequired,
    updateTweet: PropTypes.func.isRequired,
    likes: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        users: PropTypes.arrayOf(PropTypes.string.isRequired)
    }).isRequired,
    retweets: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        users: PropTypes.arrayOf(PropTypes.string.isRequired)
    }).isRequired,
    comments: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    auth: PropTypes.shape({
          isVerified: PropTypes.bool.isRequired,
          _id: PropTypes.string.isRequired,
          handle: PropTypes.string.isRequired,
          displayName: PropTypes.string,
          email: PropTypes.string.isRequired,
          displayImgSrc: PropTypes.string.isRequired,
          headerImgSrc: PropTypes.string.isRequired,
    }).isRequired,
};
Tweet.defaultProps = {
    displayName: undefined,
}

const mapStateToProps = ({auth}) => ({auth});

export default connect(mapStateToProps, actions)(Tweet);