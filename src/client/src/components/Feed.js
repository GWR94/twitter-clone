import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Tweet from "./Tweet";
import * as actions from "../actions";
import TweetInput from "./TweetInput";

class Feed extends React.Component {
    state = {
        rendered: false,
    };
    /*
        TODO
        [ ] check circle progress bar for errors when length is 0 after typing
    */

    async componentDidMount() {
        const { fetchTweets, handle } = this.props;
        await fetchTweets(handle);
        this.setState({ rendered: true });
    }

    renderTweets = tweets => {
        const { auth, user } = this.props;
        const { pinnedTweet } = auth || user;
        const pinTweets = tweets.filter(tweet => tweet._id === pinnedTweet);
        if (pinTweets.length > 0) {
            return (
                <div>
                    <Tweet
                        {...pinTweets[0]}
                        key="pinnedComponent"
                        pinnedID={pinTweets.length > 0 ? pinTweets[0]._id : ""}
                    />
                    {tweets
                        .filter(tweet => tweet._id !== pinnedTweet)
                        .sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1))
                        .map((tweet, i) => (
                            <Tweet
                                key={i}
                                {...tweet}
                                pinnedID={pinTweets.length > 0 ? pinTweets[0]._id : ""}
                            />
                        ))}
                </div>
            );
        }
        return tweets
            .sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1))
            .map((tweet, i) => (
                <Tweet key={i} {...tweet} pinnedID={pinTweets.length > 0 ? pinTweets[0]._id : ""} />
            ));
    };

    render() {
        const { tweets, showFeed } = this.props;
        const { rendered } = this.state;

        const NoTweets = () => (
            <div className="feed--noTweetsContainer">
                <h3 className="feed--noTweetsTitle">What? No Tweets yet?</h3>
                <p className="feed--noTweetsText">
                    This empty timeline won&apos;t be around for long. Start following people and
                    you’ll see Tweets show up here.
                </p>
                <button
                    type="button"
                    className="button__signupLarge"
                    style={{
                        fontSize: "14px",
                        float: "left",
                        marginTop: "5px",
                        padding: "6px 16px",
                    }}
                >
                    Find people to follow
                </button>
            </div>
        );

        return (
            <div className="feed--container">
                {showFeed && <TweetInput />}
                <div className="feed--tweetFeedContainer" id="tweetFeed">
                    {!rendered ? (
                        <div />
                    ) : (
                        <div>
                            {tweets.length === 0 ? (
                                showFeed ? (
                                    <div>
                                        <NoTweets />
                                    </div>
                                ) : null
                            ) : (
                                <div>
                                    {this.renderTweets(tweets)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

Feed.propTypes = {
    auth: PropTypes.shape({
        isVerified: PropTypes.bool,
        profileImg: PropTypes.string,
    }).isRequired,
    tweets: PropTypes.arrayOf(PropTypes.shape),
    postTweet: PropTypes.func.isRequired,
    fetchTweets: PropTypes.func.isRequired,
};

Feed.defaultProps = {
    tweets: [],
};

const mapStateToProps = ({ auth, tweets }) => ({ auth, tweets });
export default connect(
    mapStateToProps,
    actions,
)(Feed);
