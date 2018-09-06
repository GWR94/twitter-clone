import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Circle } from "rc-progress";
import autosize from "autosize";
import { Tooltip } from "reactstrap";
import * as actions from "../actions";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";

/*
    TODO
    [ ] Add tooltip for small photo icon on tweet input
    [ ] Add emoji support
*/
class TweetInput extends Component {
    constructor() {
        super();

        this.state = {
            percent: 0,
            tweetText: "",
            photoToolTipOpen: false,
            gifToolTipOpen: false,
            pollToolTipOpen: false,
            locationToolTipOpen: false,
            active: false,
        };
        this.toggleTooltip = this.toggleTooltip.bind(this);
    }

    /* eslint-disable-next-line */
    toggleTooltip(tooltip) {
        const {
            photoToolTipOpen,
            gifToolTipOpen,
            locationToolTipOpen,
            pollToolTipOpen,
        } = this.state;

        switch (tooltip) {
            case "photo":
                this.setState({
                    photoToolTipOpen: !photoToolTipOpen,
                });
                break;
            case "poll":
                this.setState({
                    pollToolTipOpen: !pollToolTipOpen,
                });
                break;
            case "gif":
                this.setState({
                    gifToolTipOpen: !gifToolTipOpen,
                });
                break;
            case "location":
                this.setState({
                    locationToolTipOpen: !locationToolTipOpen,
                });
                break;
            default:
                return null;
        }
    }

    async handleNewTweet() {
        const { tweetText } = this.state;
        const { postTweet, auth, tweets } = this.props;
        this.setState({ tweetError: true });
        await postTweet({
            tweet: tweetText,
            handle: auth.handle,
            postedAt: Date.now(),
        });
        this.renderTweets(tweets);
        this.setState({ tweetText: "", tweetError: false });
    }

    render() {
        const {
            active,
            tweetText,
            percent,
            gifToolTipOpen,
            locationToolTipOpen,
            photoToolTipOpen,
            pollToolTipOpen,
            tweetError,
        } = this.state;
        const { auth } = this.props;
        const { displayImgSrc } = auth;

        autosize(document.getElementById("tweetInput-textbox"));

        return (
            <div
                className={
                    active ? "tweetInput--container" : "tweetInput--containerLarge"
                }
                id="tweetInput-containerID"
            >
                <div className="tweetInput--innerContainer">
                    <img
                        src={displayImgSrc || defaultDisplayImg}
                        alt="User Display Img"
                        className="tweetInput--displayImg"
                    />
                    <textarea
                        type="text"
                        id="tweetInput-textbox"
                        value={tweetText}
                        className={
                            active ? "tweetInput--inputLarge" : "tweetInput--input"
                        }
                        onFocus={() => {
                            this.setState({ active: true });
                        }}
                        onBlur={() => {
                            if (tweetText.length === 0) {
                                this.setState({ active: false });
                            }
                        }}
                        onChange={e => {
                            const tweet = e.target.value;
                            if (tweet.length > 240) {
                                this.setState({ tweetError: true });
                            } else {
                                this.setState({ tweetError: false });
                            }
                            this.setState({
                                tweetText: tweet || "",
                                percent: (tweetText.length / 280) * 100,
                            });
                        }}
                        placeholder="What's happening?"
                    />
                </div>
                <i
                    className={
                        active
                            ? "far fa-smile tweetInput--emojiIcon"
                            : "far fa-image tweetInput--photoTweetIcon"
                    }
                />{" "}
                {active && (
                    <div>
                        <Circle
                            strokeWidth="10"
                            strokeColor={percent >= 100 ? "#DC3545" : "#1DA1F2"}
                            trailColor="#bac0c4"
                            trailWidth="6"
                            percent={percent}
                            className="tweetInput--progressCircle"
                        />

                        <div className="tweetInput--mediaContainer">
                            <div className="tweetInput--iconsContainer">
                                <div className="tweetInput--iconInnerContainer">
                                    <i
                                        className="far fa-image tweetInput--mediaIcon"
                                        id="tweetInput--photoID"
                                    />
                                </div>
                                <div className="tweetInput--iconInnerContainer">
                                    <i
                                        className="fas fa-file-image tweetInput--mediaIcon"
                                        id="tweetInput--gifID"
                                    />
                                </div>
                                <div className="tweetInput--iconInnerContainer">
                                    <i
                                        className="fas fa-chart-bar tweetInput--mediaIcon"
                                        id="tweetInput--pollID"
                                    />
                                </div>
                                <div className="tweetInput--iconInnerContainer">
                                    <i
                                        className="fas fa-map-marker-alt tweetInput--mediaIcon"
                                        id="tweetInput--locationID"
                                    />
                                </div>
                            </div>
                            <div className="tweetInput--mediaControlsContainer">
                                <Tooltip
                                    placement="top"
                                    isOpen={photoToolTipOpen}
                                    target="tweetInput--photoID"
                                    toggle={() => this.toggleTooltip("photo")}
                                    delay={250}
                                >
                                    Add photos or video
                                </Tooltip>
                                <Tooltip
                                    placement="top"
                                    isOpen={gifToolTipOpen}
                                    target="tweetInput--gifID"
                                    toggle={() => this.toggleTooltip("gif")}
                                    delay={250}
                                >
                                    Add a GIF
                                </Tooltip>
                                <Tooltip
                                    placement="top"
                                    isOpen={pollToolTipOpen}
                                    target="tweetInput--pollID"
                                    toggle={() => this.toggleTooltip("poll")}
                                    delay={250}
                                >
                                    Add poll
                                </Tooltip>
                                <Tooltip
                                    placement="top"
                                    isOpen={locationToolTipOpen}
                                    target="tweetInput--locationID"
                                    toggle={() => this.toggleTooltip("location")}
                                    delay={250}
                                >
                                    Add location
                                </Tooltip>
                                <i className="fas fa-plus-circle icon__addTweet" />
                                <button
                                    type="button"
                                    className="btn button__signup"
                                    onClick={() => this.handleNewTweet()}
                                    disabled={tweetError}
                                >
                                    Tweet
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

TweetInput.propTypes = {
    auth: PropTypes.shape({
        displayImgSrc: PropTypes.string,
    }).isRequired,
};

const mapStateToProps = ({ auth, tweets }) => ({ auth, tweets });

export default connect(
    mapStateToProps,
    actions,
)(TweetInput);
