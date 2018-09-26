import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Tweet from "./Tweet";
import * as actions from "../actions";
import TweetInput from "./TweetInput";
import loader from "../../../../public/images/loader.gif";

class Feed extends React.Component {
    state = {
        rendered: false,
        pinnedTweet: false
    };
    /*
        TODO
        [ ] check circle progress bar for errors when length is 0 after typing
    */

    async componentWillMount() {
        const { fetchTweets, handle, tweets } = this.props;
        await fetchTweets(handle);
        this.setState({ rendered: true });
        const pinnedTweet = tweets.filter(tweet => tweet.pinnedTweet === true);
        if(pinnedTweet) {
            this.setState({ pinnedTweet: true });
        }
    }

    /* eslint-disable-next-line */
    renderTweets(tweets) {
        return tweets
            .filter(tweet => tweet.pinnedTweet !== true)
            .sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1))
            .map((tweet, i) => <Tweet key={i} {...tweet} />);
    }

    render() {
        const { tweets, showFeed } = this.props;
        const { rendered, pinnedTweet } = this.state;

        const tweetPinned = tweets.filter(tweet => tweet.pinnedTweet === true);


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
                                        <Link to="/profile/jgower94">To jgower94</Link>
                                    </div>
                                ) : null
                            ) : (
                                <div>
                                    { pinnedTweet && <Tweet {...tweetPinned[0]} />}
                                    {this.renderTweets(tweets)}
                                    <Link to="/profile/jgower94">To jgower94</Link>
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
