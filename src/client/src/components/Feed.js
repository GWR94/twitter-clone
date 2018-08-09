import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Tweet from "./Tweet";
import * as actions from "../actions";
import TweetInput from "./TweetInput";
import { Link } from 'react-router-dom';
class Feed extends React.Component {
    /*
        TODO
        [ ] check circle progress bar for errors when length is 0 after typing
    */
    constructor() {
        super();
        this.state = {};
    }

    async componentDidMount() {
        const { fetchTweets, auth } = this.props;
        await fetchTweets(auth.handle);
    }

    /* eslint-disable-next-line */
    renderTweets(tweets) {
        return tweets
            .sort((a, b) => (a.postedAt > b.postedAt ? -1 : 1))
            .map((tweet, i) => <Tweet key={i} {...tweet} />);
    }

    render() {
        const { tweets } = this.props;

        return (
            <div className="feed--container">
                <TweetInput />
                <div className="feed--tweetFeedContainer" id="tweetFeed">
                    {tweets.length === 0 ? (
                        <span>No Tweets</span>
                    ) : (
                        this.renderTweets(tweets)
                    )}
                    <Link to="/profile/james_gower">CLICK</Link>
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
