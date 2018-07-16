import React from 'react';
import {connect} from 'react-redux';
import * as actions from '../actions';
import {Circle} from 'rc-progress';
import autosize from 'autosize';
import {Tooltip} from 'reactstrap';

class Feed extends React.Component {
    constructor() {
        super();

        this.state = {
            percent: 0,
            tweetText: '',
            photoToolTipOpen: false,
            gifToolTipOpen: false,
            pollToolTipOpen: false,
            locationToolTipOpen: false,
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
        this.setState({
            photoToolTipOpen: !this.state.photoToolTipOpen
        });
    }

    toggleGif() {
        this.setState({
            gifToolTipOpen: !this.state.gifToolTipOpen
        });
    }
    togglePoll() {
        this.setState({
            pollToolTipOpen: !this.state.pollToolTipOpen
        });
    }
    toggleLocation() {
        this.setState({
            locationToolTipOpen: !this.state.locationToolTipOpen
        });
    }

    render() {

        autosize(document.getElementById('tweet-textbox'));

        return (
            <div className="feed--container">
                <div
                    className={this.state.active
                    ? "feed--tweetContainerLarge"
                    : "feed--tweetContainer"}
                    id="tweet-container">
                    <div className="input--container">
                        <img src={this.props.auth.profileImg} className="tweet--displayImg"/>
                        <textarea
                            type="text"
                            id="tweet-textbox"
                            className={this.state.active
                            ? "feed--tweetInputLarge"
                            : "feed--tweetInput"}
                            onClick={() => {
                            this.setState({active: true});
                        }}
                            onChange={e => {
                            this.setState({
                                tweetText: e.target.value || ''
                            });
                            this.setState({
                                percent: this.state.tweetText.length / 280 * 100
                            });
                        }}
                            placeholder="What's happening?"/>
                    </div>
                    <i
                        id="tweet-icon"
                        className={this.state.active
                        ? "far fa-smile icon--emoji"
                        : "far fa-image icon--tweet"}/> {this.state.active && (

                        <div>
                            <Circle
                                strokeWidth="10"
                                strokeColor={this.state.percent >= 100
                                ? "#DC3545"
                                : "#1DA1F2"}
                                trailColor="#bac0c4"
                                trailWidth="6"
                                percent={this.state.percent}
                                className="tweet--progressbar"/>

                            <div className="tweet--mediaContainer">
                                <div className="tweet--iconsContainer">
                                    <div className="media--container">
                                        <i className="far fa-image icon--media" id="photoTooltip"></i>
                                    </div>
                                    <div className="media--container">
                                        <i className="fas fa-file-image icon--media" id="gifTooltip"></i>
                                    </div>
                                    <div className="media--container">
                                        <i className="fas fa-chart-bar icon--media" id="pollTooltip"></i>
                                    </div>
                                    <div className="media--container">
                                        <i className="fas fa-map-marker-alt icon--media" id="locationTooltip"></i>
                                    </div>
                                </div>
                                <div className="tweet--mediaControlsContainer">
                                    <i className="fas fa-plus-circle icon--addTweet"></i>
                                    <button className="btn button__signup">Tweet</button>
                                </div>
                            </div>
                            <Tooltip
                                placement="top"
                                isOpen={this.state.photoToolTipOpen}
                                target={"photoTooltip"}
                                toggle={this.togglePhoto}
                                delay={250}>
                                Add photos or video
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                isOpen={this.state.gifToolTipOpen}
                                target={"gifTooltip"}
                                toggle={this.toggleGif}
                                delay={250}>
                                Add a GIF
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                isOpen={this.state.pollToolTipOpen}
                                target={"pollTooltip"}
                                toggle={this.togglePoll}
                                delay={250}>
                                Add poll
                            </Tooltip>
                            <Tooltip
                                placement="top"
                                isOpen={this.state.locationToolTipOpen}
                                target={"locationTooltip"}
                                toggle={this.toggleLocation}
                                delay={250}>
                                Add location
                            </Tooltip>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return {auth}
}
export default connect(mapStateToProps, actions)(Feed);