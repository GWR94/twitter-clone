import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {Circle} from "rc-progress";
import autosize from "autosize";
import {Tooltip} from "reactstrap";
import * as actions from "../actions";

class Feed extends React.Component {
    constructor() {
        super();

        this.state = {
            percent: 0,
            tweetText: "",
            photoToolTipOpen: false,
            gifToolTipOpen: false,
            pollToolTipOpen: false,
            locationToolTipOpen: false
        };

        this.togglePhoto = this
            .togglePhoto
            .bind(this);
        this.toggleGif = this
            .toggleGif
            .bind(this);
        this.togglePoll = this
            .togglePoll
            .bind(this);
        this.toggleLocation = this
            .toggleLocation
            .bind(this);
    }

    togglePhoto() {
        const {photoToolTipOpen} = this.state;
        this.setState({
            photoToolTipOpen: !photoToolTipOpen
        });
    }

    toggleGif() {
        const {gifToolTipOpen} = this.state;
        this.setState({
            gifToolTipOpen: !gifToolTipOpen
        });
    }

    togglePoll() {
        const {pollToolTipOpen} = this.state;
        this.setState({
            pollToolTipOpen: !pollToolTipOpen
        });
    }

    toggleLocation() {
        const {locationToolTipOpen} = this.state;
        this.setState({
            locationToolTipOpen: !locationToolTipOpen
        });
    }

    render() {
        autosize(document.getElementById("tweet-textbox"));
        const {
            active,
            tweetText,
            percent,
            gifToolTipOpen,
            locationToolTipOpen,
            photoToolTipOpen,
            pollToolTipOpen
        } = this.state;
        const {auth} = this.props;
        return (
            <div className="feed--container">
                <div
                    className={active
                    ? "feed--tweetContainerLarge"
                    : "feed--tweetContainer"}
                    id="tweet-container">
                    <div className="input--container">
                        <img
                            src={auth.profileImg}
                            alt="User Display Img"
                            className="tweet--displayImg"/>
                        <textarea
                            type="text"
                            id="tweet-textbox"
                            className={active
                            ? "feed--tweetInputLarge"
                            : "feed--tweetInput"}
                            onClick={() => {
                            this.setState({active: true});
                        }}
                            onChange={(e) => {
                            this.setState({
                                tweetText: e.target.value || ""
                            });
                            this.setState({
                                percent: tweetText.length / 280 * 100
                            });
                        }}
                            placeholder="What's happening?"/>
                    </div>
                    <i
                        id="tweet-icon"
                        className={active
                        ? "far fa-smile icon--emoji"
                        : "far fa-image icon--tweet"}/> {" "}
                    {active && (
                        <div>
                            <Circle
                                strokeWidth="10"
                                strokeColor={percent >= 100
                                ? "#DC3545"
                                : "#1DA1F2"}
                                trailColor="#bac0c4"
                                trailWidth="6"
                                percent={percent}
                                className="tweet--progressbar"/>

                            <div className="tweet--mediaContainer">
                                <div className="tweet--iconsContainer">
                                    <div className="media--container">
                                        <i className="far fa-image icon--media" id="photoTooltip"/>
                                    </div>
                                    <div className="media--container">
                                        <i className="fas fa-file-image icon--media" id="gifTooltip"/>
                                    </div>
                                    <div className="media--container">
                                        <i className="fas fa-chart-bar icon--media" id="pollTooltip"/>
                                    </div>
                                    <div className="media--container">
                                        <i className="fas fa-map-marker-alt icon--media" id="locationTooltip"/>
                                    </div>
                                </div>
                                <div className="tweet--mediaControlsContainer">
                                    <i className="fas fa-plus-circle icon--addTweet"/>
                                    <button type="button" className="btn button__signup">Tweet</button>
                                </div>
                            </div>
                            <Tooltip
                                placement="top"
                                isOpen={photoToolTipOpen}
                                target="photoTooltip"
                                toggle={this.togglePhoto}
                                delay={250}>
                                Add photos or video
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                isOpen={gifToolTipOpen}
                                target="gifTooltip"
                                toggle={this.toggleGif}
                                delay={250}>
                                Add a GIF
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                isOpen={pollToolTipOpen}
                                target="pollTooltip"
                                toggle={this.togglePoll}
                                delay={250}>
                                Add poll
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                isOpen={locationToolTipOpen}
                                target="locationTooltip"
                                toggle={this.toggleLocation}
                                delay={250}>
                                Add location
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

Feed.propTypes = {
    auth: PropTypes
        .shape({
            isVerified: PropTypes.bool,
            profileImg: PropTypes.string
        })
        .isRequired,
};

const mapStateToProps = ({auth}) => ({auth});

export default connect(mapStateToProps, actions)(Feed);
