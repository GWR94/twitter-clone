import React from "react";
import PropTypes from "prop-types";
import { Tooltip } from "reactstrap";
import timeago from "timeago.js";
import TimeAgo from "timeago-react";
import { connect } from "react-redux";
import * as actions from "../actions";
import verifiedIcon from "../../../../public/images/twitterVerified.png";
import twitterLocale from "../services/twitterLocale";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";

/*
    TODO
    [x] Add verified option
    [x] Add dot between time ago & handle
    [x] Add tooltips for interactions
    [ ] Fix retweet & undo retweet
    [x] Delete tweet when deleteTweet function is executed
    [ ] Add functionality for dropdown menu
*/

class Tweet extends React.Component {
    constructor() {
        super();

        this.likeRef = React.createRef();
        this.retweetRef = React.createRef();

        this.state = {
            commentsTooltipOpen: false,
            retweetTooltipOpen: false,
            likeTooltipOpen: false,
            messageTooltipOpen: false,
            dropdownOpen: false,
            showComponent: true,
            pinnedTweet: false,
        };
    }

    componentDidMount() {
        this.setState({ retweetTooltipOpen: false, likeTooltipOpen: false });
        const { retweets, likes, auth, pinnedTweet } = this.props;
        if (pinnedTweet) {
            this.setState({ pinnedTweet: true });
        } else {
            this.setState({ pinnedTweet: false });
        }
        if (retweets.users.indexOf(auth.handle) > -1) {
            this.retweetRef.current.className = "tweet--userRetweet";
        } else {
            this.retweetRef.current.className = "tweet--retweet";
        }
        if (likes.users.indexOf(auth.handle) > -1) {
            this.likeRef.current.className = "tweet--userLiked";
        } else {
            this.likeRef.current.className = "tweet--like";
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
            commentsTooltipOpen,
            likeTooltipOpen,
            messageTooltipOpen,
            retweetTooltipOpen,
            dropdownOpen,
            showComponent,
            pinnedTweet,
        } = this.state;

        timeago.register("twitter", twitterLocale);
        return (
            showComponent && (
                <div className="tweet--container">
                    {pinnedTweet && (
                        <div className="tweet--pinnedTextContainer">
                            <i className="fas fa-map-pin icon__pinnedTweet" />
                            <p className="tweet--pinnedText">Pinned Tweet</p>
                        </div>
                    )}
                    <i
                        className="fas fa-chevron-down icon__dropdownTweet"
                        onClick={() => {
                            const newState = !dropdownOpen;
                            this.setState({ dropdownOpen: newState });
                        }}
                    />
                    {dropdownOpen && (
                        <div className="tweet--dropdownContainer">
                            <p className="tweet--dropdownItem">Share via Direct Message</p>
                            <p className="tweet--dropdownItem">Copy Link to Tweet</p>
                            <p className="tweet--dropdownItem">Embed Tweet</p>
                            <p
                                className="tweet--dropdownItem"
                                onClick={async () => {
                                    const { pinTweet } = this.props;
                                    const values = {
                                        handle,
                                        tweetID: _id,
                                    };
                                    await pinTweet(values);
                                    this.setState({ dropdownOpen: false });
                                    if (pinnedTweet) {
                                        this.setState({ pinnedTweet: false });
                                    }
                                }}
                            >
                                {pinnedTweet
                                    ? "Unpin from profile page"
                                    : "Pin to your profile page"}
                            </p>
                            <p
                                className="tweet--dropdownItem"
                                onClick={() => {
                                    const { deleteTweet } = this.props;
                                    deleteTweet(_id);
                                    this.setState({ showComponent: false });
                                }}
                            >
                                Delete Tweet
                            </p>
                            <hr style={{ margin: "5px 0" }} />
                            <p className="tweet--dropdownItem">Add to new Moment</p>
                        </div>
                    )}

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
                                    id={`comment_${_id}`}
                                />
                                {comments.length > 0 && (
                                    <span className="tweet--interactionText">
                                        {comments.length}
                                    </span>
                                )}
                            </div>
                            <div
                                className={
                                    retweets.users.indexOf(auth.handle) > -1
                                        ? "tweet--userRetweet"
                                        : "tweet--retweet"
                                }
                                ref={this.retweetRef}
                                onClick={async () => {
                                    await updateTweet({
                                        tweetID: _id,
                                        action: "retweet",
                                        user: auth.handle,
                                    });
                                }}
                            >
                                <i
                                    className="fas fa-retweet tweet--interaction"
                                    id={`retweet_${_id}`}
                                />
                                {retweets.amount > 0 && (
                                    <span className="tweet--interactionText">
                                        {retweets.amount}
                                    </span>
                                )}
                            </div>
                            <div
                                ref={this.likeRef}
                                className={
                                    likes.users.indexOf(auth.handle) > -1
                                        ? "tweet--userLiked"
                                        : "tweet--like"
                                }
                                onClick={async () => {
                                    await updateTweet({
                                        tweetID: _id,
                                        action: "like",
                                        user: auth.handle,
                                    });
                                }}
                            >
                                <i className="far fa-heart tweet--interaction" id={`like_${_id}`} />
                                {likes.amount > 0 && (
                                    <span className="tweet--interactionText">{likes.amount}</span>
                                )}
                            </div>
                            <div className="tweet--message">
                                <i
                                    className="far fa-envelope tweet--interaction"
                                    id={`dm_${_id}`}
                                />
                            </div>
                        </div>
                    </div>
                    <Tooltip
                        placement="top"
                        isOpen={commentsTooltipOpen}
                        target={`comment_${_id}`}
                        toggle={() => this.toggleTooltip("comment")}
                        delay={250}
                    >
                        Reply
                    </Tooltip>

                    <Tooltip
                        placement="top"
                        isOpen={retweetTooltipOpen}
                        target={`retweet_${_id}`}
                        toggle={() => this.toggleTooltip("retweet")}
                        delay={250}
                    >
                        {retweets.users.indexOf(auth.handle) > -1 ? "Undo Retweet" : "Retweet"}
                    </Tooltip>

                    <Tooltip
                        placement="top"
                        isOpen={likeTooltipOpen}
                        target={`like_${_id}`}
                        toggle={() => this.toggleTooltip("like")}
                        delay={250}
                    >
                        {likes.users.indexOf(auth.handle) > -1 ? "Undo Like" : "Like"}
                    </Tooltip>
                    <Tooltip
                        placement="top"
                        isOpen={messageTooltipOpen}
                        target={`dm_${_id}`}
                        toggle={() => this.toggleTooltip("message")}
                        delay={250}
                    >
                        Direct Message
                    </Tooltip>
                </div>
            )
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
    deleteTweet: PropTypes.func.isRequired,
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
        displayImg: PropTypes.string,
        headerImg: PropTypes.string,
    }).isRequired,
    pinnedTweet: PropTypes.bool,
};
Tweet.defaultProps = {
    displayImgSrc: null,
    pinnedTweet: false,
};

const mapStateToProps = ({ auth, user, tweets }) => ({ auth, user, tweets });

export default connect(
    mapStateToProps,
    actions,
)(Tweet);
