import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as actions from "../actions";
import TweetInput from "./TweetInput";

class MyFirstTweet extends React.Component {
    async handleNewTweet(exampleTweet) {
        const { postTweet, auth, tweets } = this.props;
        await postTweet({
            tweet: exampleTweet,
            handle: auth.handle,
            postedAt: Date.now(),
        });
        this.renderTweets(tweets);
    }

    render() {
        const { auth } = this.props;
        const { displayName, handle, displayImgSrc } = auth;
        return (
            <div className="myFirstTweet--container">
                <div className="myFirstTweet--sampleContainer">
                    <div className="myFirstTweet--textContainer">
                        <h4 className="myFirstTweet--title">Send your first Tweet</h4>
                        <p className="myFirstTweet--subtitle">
                            We&apos;ve got your first Tweet ready to go. The hashtag #myFirstTweet
                            will help others find and chat with you.
                        </p>
                    </div>
                    <div className="myFirstTweet--tweetContainer">
                        <div className="myFirstTweet--displayImgContainer">
                            {displayImgSrc && (
                                <img
                                    src={displayImgSrc}
                                    className="myFirstTweet--displayImg"
                                    alt="Display Image"
                                />
                            )}
                        </div>
                        <div className="myFirstTweet--textContainer">
                            <div className="myFirstTweet--tweetInfoContainer">
                                <p className="myFirstTweet--displayName">{displayName}</p>
                                <p className="myFirstTweet--handle">@{handle}</p>
                            </div>
                            <div className="myFirstTweet--tweetTextContainer">
                                <p className="myFirstTweet--tweetText">
                                    Just setting up my Twitter.{" "}
                                    <span className="myFirstTweet--hashtag">#myfirstTweet</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="myFirstTweet--buttonContainer">
                        <button
                            className="button__tweet"
                            type="button"
                            style={{
                                marginTop: "30px",
                            }}
                            onClick={() => {
                                const { handleDefaultTweet } = this.props;
                                handleDefaultTweet("Just setting up my Twitter. #myfirstTweet");
                            }}
                        >
                            Tweet
                        </button>
                    </div>
                </div>

                <div className="myFirstTweet--tweetContainer">
                    <div className="myFirstTweet--displayImgContainer">
                        <img
                            src={displayImgSrc || defaultDisplayImg}
                            className="myFirstTweet--displayImg"
                            alt="Display Image"
                        />
                    </div>
                    <div className="myFirstTweet--textContainer">
                        <div className="myFirstTweet--tweetInfoContainer">
                            <p className="myFirstTweet--displayName">{displayName}</p>
                            <p className="myFirstTweet--handle">@{handle}</p>
                        </div>
                        <div className="myFirstTweet--tweetTextContainer">
                            <p className="myFirstTweet--tweetText">
                                Hello Twitter!{" "}
                                <span className="myFirstTweet--hashtag">#myfirstTweet</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="myFirstTweet--buttonContainer">
                    <button
                        className="button__tweet"
                        type="button"
                        style={{
                            marginTop: "10px",
                        }}
                        onClick={() => {
                            const { renderTweets } = this.props;
                            this.handleNewTweet("Hello Twitter! #myfirstTweet");
                            renderTweets();
                        }}
                    >
                        Tweet
                    </button>
                </div>
                <p
                    className="myFirstTweet--subtitle"
                    style={{
                        marginTop: "30px",
                    }}
                >
                    Or write your own
                </p>
                <TweetInput large />
            </div>
        );
    }
}

MyFirstTweet.propTypes = {
    auth: PropTypes.shape({ isVerified: PropTypes.bool, profileImg: PropTypes.string }).isRequired,
    postTweet: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(MyFirstTweet);
