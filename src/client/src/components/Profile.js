import React from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import NavBar from "./NavBar";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";
import Trends from "./Trends";

class Profile extends React.Component {
    constructor() {
        super();

        this.state = {};
    }
    
    componentDidMount() {
        const { fetchUser } = this.props;
        fetchUser();
    }
    /*
        TODO
        [ ] setup grid layout css - flexbox? css grid?
    */

    render() {
        const { auth } = this.props;
        const userInfo = [
            {
                description: "Tweets",
                value: auth.tweets.length,
            },
            {
                description: "Following",
                value: auth.following.length,
            },
            {
                description: "Followers",
                value: auth.followers.length,
            },
            {
                description: "Likes",
                value: auth.favouritedTweets.length,
            },
            {
                description: "Retweets",
                value: auth.retweetedTweets.length,
            },
            {
                description: "Lists",
                value: auth.lists.length,
            },
            {
                description: "Moments",
                value: auth.moments.length,
            },
        ];

        return (
            <div>
                <NavBar />
                <div className="profile--container">
                    <header className="profile--header" />
                    <div className="profile--infoBottomBorder" />
                    <div className="profile--gridContainer">
                        <div className="profile--imgContainer">
                            <img
                                src={defaultDisplayImg}
                                className="profile--displayImg"
                                alt="Profile Img"
                            />
                        </div>
                        <div className="profile--information">
                            {userInfo.map(info => (
                                <div className="profile--info">
                                    <p className="profile--infoDescription">{info.description}</p>
                                    <p className="profile--infoValue">{info.value}</p>
                                </div>
                            ))}
                            <button className="profile--editButton">Edit Profile</button>
                        </div>
                        <div className="profile--overview">
                            <h1>Overview</h1>
                        </div>
                        <div className="profile--main">
                            <h1>Main</h1>
                        </div>

                        <div className="profile--activity">
                            <h1>Activity</h1>
                        </div>
                        <div className="profile--trends">
                            <Trends />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(Profile);
