import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "reactstrap";
import timeago from "timeago.js";
import TimeAgo from "timeago-react";
import { connect } from "react-redux";
import * as actions from "../actions";
import verifiedIcon from "../../../../public/images/twitterVerified.png";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";
import twitterLocale from "../services/twitterLocale";

/*
    TODO
    [x] Add verified option
    [x] Add dot between time ago & handle
    [x] Add tooltips for interactions
    [ ] Fix retweet & undo retweet
*/

class Tweet extends React.Component {
    constructor() {
        super();
        this.state = {
            userRetweeted: false,
            userLiked: false,
            commentsTooltipOpen: false,
            retweetTooltipOpen: false,
            likeTooltipOpen: false,
            messageTooltipOpen: false,
        };

        this.toggleTooltip = this.toggleTooltip.bind(this);
    }

    componentDidMount() {
        const { retweets, likes, auth } = this.props;
        if (retweets.users.indexOf(auth.handle) > -1) {
            this.setState({ userRetweeted: true });
        }
        if (likes.users.indexOf(auth.handle) > -1) {
            this.setState({ userLiked: true });
        }
    }

    /* eslint-disable-next-line */
    toggleTooltip(tooltip) {
        const {
            commentsTooltipOpen,
            retweetTooltipOpen,
            likeTooltipOpen,
            messageTooltipOpen,
        } = this.state;

        switch (tooltip) {
            case "comment":
                this.setState({
                    commentsTooltipOpen: !commentsTooltipOpen,
                });
                break;
            case "retweet":
                this.setState({
                    retweetTooltipOpen: !retweetTooltipOpen,
                });
                break;
            case "like":
                this.setState({
                    likeTooltipOpen: !likeTooltipOpen,
                });
                break;
            case "message":
                this.setState({
                    messageTooltipOpen: !messageTooltipOpen,
                });
                break;
            default:
                return null;
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
            postedAt,
        } = this.props;

        const {
            userRetweeted,
            userLiked,
            commentsTooltipOpen,
            likeTooltipOpen,
            messageTooltipOpen,
            retweetTooltipOpen,
        } = this.state;

        timeago.register("twitter", twitterLocale);

        return (
            <div className="tweet--container">
                <div className="tweet--displayImgContainer">
                    <img
                        src={displayImgSrc || defaultDisplayImg}
                        alt="Display Img"
                        className="tweet--displayImg"
                    />
                </div>
                <div className="tweet--textContainer">
                    <div className="tweet--nameTextContainer">
                        {displayName && <p className="tweet--nameText">{displayName}</p>}
                        {isVerified && (
                            <img
                                alt="Verified Profile"
                                src={verifiedIcon}
                                className="tweet--verifiedIcon"
                            />
                        )}
                        <p className="tweet--handleText">
                            @{handle} · <TimeAgo datetime={postedAt} locale="twitter" />
                        </p>
                    </div>
                    <div className="tweet--tweetContainer">
                        <p className="tweet--tweetText">{tweetText}</p>
                    </div>
                    <div className="tweet--interactionsContainer">
                        <div className="tweet--comment">
                            <i
                                className="far fa-comment tweet--interaction"
                                id="tweet--commentsID"
                            />
                            {comments.length > 0 && (
                                <span className="tweet--interactionText">
                                    {comments.length}
                                </span>
                            )}
                        </div>
                        <div
                            className={
                                userRetweeted ? "tweet--userRetweet" : "tweet--retweet"
                            }
                            onClick={async () => {
                                await updateTweet({
                                    tweetID: _id,
                                    action: "retweet",
                                    user: auth.handle,
                                });
                                this.setState({ userRetweeted: !userRetweeted });
                            }}
                        >
                            <i
                                className="fas fa-retweet tweet--interaction"
                                id="tweet--retweetID"
                            />
                            {retweets.amount > 0 && (
                                <span className="tweet--interactionText">
                                    {retweets.amount}
                                </span>
                            )}
                        </div>
                        <div className={userLiked ? "tweet--userLiked" : "tweet--like"}>
                            <i
                                className="far fa-heart tweet--interaction"
                                id="tweet--likeID"
                                onClick={async () => {
                                    await updateTweet({
                                        tweetID: _id,
                                        action: "like",
                                        user: auth.handle,
                                    });
                                    this.setState({ userLiked: !userLiked });
                                }}
                            />
                            {likes.amount > 0 && (
                                <span className="tweet--interactionText">
                                    {likes.amount}
                                </span>
                            )}
                        </div>
                        <div className="tweet--message">
                            <i
                                className="far fa-envelope tweet--interaction"
                                id="tweet--messageID"
                            />
                        </div>
                    </div>
                </div>
                <Tooltip
                    placement="top"
                    isOpen={commentsTooltipOpen}
                    target="tweet--commentsID"
                    toggle={() => this.toggleTooltip("comment")}
                    delay={250}
                >
                    Reply
                </Tooltip>
                <Tooltip
                    placement="top"
                    isOpen={retweetTooltipOpen}
                    target="tweet--retweetID"
                    toggle={() => this.toggleTooltip("retweet")}
                    delay={250}
                >
                    {userRetweeted ? "Undo Retweet" : "Retweet"}
                </Tooltip>
                <Tooltip
                    placement="top"
                    isOpen={likeTooltipOpen}
                    target="tweet--likeID"
                    toggle={() => this.toggleTooltip("like")}
                    delay={250}
                >
                    {userLiked ? "Undo Like" : "Like"}
                </Tooltip>
                <Tooltip
                    placement="top"
                    isOpen={messageTooltipOpen}
                    target="tweet--messageID"
                    toggle={() => this.toggleTooltip("message")}
                    delay={250}
                >
                    Direct Message
                </Tooltip>
            </div>
        );
    }
}
Tweet.propTypes = {
    displayName: PropTypes.string.isRequired,
    displayImgSrc: PropTypes.string,
    handle: PropTypes.string.isRequired,
    tweetText: PropTypes.string.isRequired,
    isVerified: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
    postedAt: PropTypes.string.isRequired,
    updateTweet: PropTypes.func.isRequired,
    likes: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        users: PropTypes.arrayOf(PropTypes.string.isRequired),
    }).isRequired,
    retweets: PropTypes.shape({
        amount: PropTypes.number.isRequired,
        users: PropTypes.arrayOf(PropTypes.string.isRequired),
    }).isRequired,
    comments: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    auth: PropTypes.shape({
        isVerified: PropTypes.bool.isRequired,
        _id: PropTypes.string.isRequired,
        handle: PropTypes.string.isRequired,
        displayName: PropTypes.string,
        email: PropTypes.string.isRequired,
        displayImgSrc: PropTypes.string,
        headerImgSrc: PropTypes.string,
    }).isRequired,
};
Tweet.defaultProps = {
    displayImgSrc: null,
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(Tweet);
