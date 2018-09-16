import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import autosize from "autosize";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import * as actions from "../actions";
import NavBar from "./NavBar";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";
import Trends from "./Trends";
import Feed from "./Feed";
import MyFirstTweet from "./MyFirstTweet";

class Profile extends React.Component {
    state = {
        numTweets: 0,
        editMode: true,
        themeColor: "#1DA1F2",
        birthdaySelection: true,
        year: null,
        month: null,
        day: null,
        monthPrivacy: "both",
        yearPrivacy: "private",
        monthDropdownOpen: false,
        yearDropdownOpen: false,
    };

    /*
        TODO
        [x] setup grid layout css - flexbox? css grid?
        [ ] Change DM icon to activity
        [ ] Add functionality for activity icon
        [x] Remove unused icon when none are used for activity bar
        [ ] Add Media when user has tweeted images/videos
        [x] Blur background when in edit mode
        [ ] Set theme color around all site
    */

    componentDidMount() {
        const { fetchUser, auth } = this.props;
        fetchUser();
        this.setState({ numTweets: auth.tweets.length });
    }

    handleDefaultTweet = async tweet => {
        const { postTweet, auth } = this.props;
        const { numTweets } = this.state;
        const { themeColor } = auth;
        await postTweet({
            tweet,
            handle: auth.handle,
            postedAt: Date.now(),
        });
        this.setState({ numTweets: numTweets + 1, themeColor });
    };

    /* eslint-disable-next-line */
    renderProfileInfo(userInfo) {
        const filteredInfo = userInfo.filter(info => info.value > 0);
        filteredInfo.push(userInfo[5]); /* Add Lists */
        filteredInfo.push(userInfo[6]); /* Add Moments */

        return filteredInfo.map(info => (
            <div className="profile--info">
                <p className="profile--infoDescription">{info.description}</p>
                <p className="profile--infoValue">{info.value}</p>
            </div>
        ));
    }

    renderPrivacy(type) {
        const { monthPrivacy, yearPrivacy } = this.state;
        switch (type === "month" ? monthPrivacy : yearPrivacy) {
            case "all":
                return <i className="fas fa-globe-americas profileOverview--switchIcon" />;
            case "followers":
                return <i className="fas fa-users profileOverview--switchIcon" />;
            case "following":
                return <i className="fas fa-user profileOverview--switchIcon" />;
            case "both":
                return <i className="fas fa-exchange-alt profileOverview--switchIcon" />;
            case "private":
                return <i className="fas fa-lock profileOverview--switchIcon" />;
            default:
                return null;
        }
    }

    render() {
        const { auth } = this.props;
        const {
            numTweets,
            editMode,
            themeColor,
            birthdaySelection,
            year,
            month,
            day,
            monthDropdownOpen,
            monthPrivacy,
            yearDropdownOpen,
            yearPrivacy,
        } = this.state;

        const {
            handle,
            displayName,
            profileOverview,
            birthPlace,
            birthday,
            dateCreated,
            location,
            website,
        } = auth;

        const formattedBirthPlace = birthPlace && birthPlace.split(",").slice(0, 1);
        const formattedBirthday = `${birthday.monthObj.month} ${birthday.dayObj.day}, 
        ${birthday.yearObj.year}`;

        autosize(document.getElementById("profile--bioTextArea"));

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
                <NavBar transparent={editMode} />
                <div className={editMode ? "profile--container" : "profile--container"}>
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
                            {this.renderProfileInfo(userInfo)}
                            {editMode ? (
                                <div className="profile--buttonContainer">
                                    <button
                                        className="button__themeColor"
                                        type="button"
                                        onClick={() => this.setState({ editMode: false })}
                                    >
                                        Cancel
                                    </button>
                                    <button className="button__lightBlue" type="button">
                                        Save changes
                                    </button>
                                </div>
                            ) : (
                                <div className="profile--buttonContainer">
                                    <button
                                        className="button__themeColor"
                                        type="button"
                                        onClick={() => this.setState({ editMode: true })}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            )}
                        </div>
                        {editMode ? (
                            <div className="profile--overviewEditMode">
                                <input
                                    placeholder="Name"
                                    type="text"
                                    className="profile--displayNameInput"
                                    value={displayName}
                                    onChange={e => this.setState({ displayName: e.target.value })}
                                />
                                <p className="profile--handleTextEdit">@{handle}</p>
                                <textarea
                                    placeholder="Bio"
                                    rows={1}
                                    id="profile--bioTextArea"
                                    className="profile--bioTextArea"
                                    onChange={e => this.setState({ bio: e.target.value })}
                                />
                                <input
                                    placeholder="Location"
                                    type="text"
                                    className="profile--textInput"
                                    value={location}
                                    onChange={e => this.setState({ location: e.target.value })}
                                />
                                <input
                                    placeholder="Website"
                                    type="text"
                                    className="profile--textInput"
                                    value={website}
                                    onChange={e => this.setState({ website: e.target.value })}
                                />
                                <button
                                    className="button__themeColor"
                                    type="button"
                                    style={{
                                        width: "100%",
                                        marginBottom: "4px",
                                    }}
                                >
                                    Theme color
                                </button>
                                {birthdaySelection ? (
                                    <div style={{ marginTop: "10px" }}>
                                        <p className="profile--birthdayText">Birthday</p>
                                        <p className="profile--birthdayText">
                                            This should be your date of birth, whether this account
                                            is for your business, event, or even your cat.
                                        </p>
                                        <MonthPicker
                                            defaultValue="Month"
                                            onChange={newMonth => {
                                                this.setState({ month: newMonth });
                                            }}
                                            value={month}
                                            optionClasses="profileOverview--monthContainer"
                                            classes="profileOverview--dropdown"
                                            day={day}
                                        />
                                        <DayPicker
                                            defaultValue="Day"
                                            onChange={newDay => {
                                                this.setState({ day: newDay });
                                            }}
                                            value={day}
                                            optionClasses="profileOverview--dayContainer"
                                            classes="profileOverview--dropdown"
                                            year={year}
                                            month={month}
                                        />
                                        <div
                                            className="profileOverview--privacyIconContainer"
                                            onClick={() =>
                                                this.setState({
                                                    monthDropdownOpen: true,
                                                    yearDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <i className="fas fa-caret-down icon__caret" />
                                            {this.renderPrivacy("month")}
                                        </div>
                                        <YearPicker
                                            defaultValue="Year"
                                            onChange={newYear => {
                                                this.setState({ year: newYear });
                                            }}
                                            classes="profileOverview--dropdown"
                                            optionClasses="profileOverview--yearContainer"
                                        />
                                        <div
                                            className="profileOverview--privacyIconContainer"
                                            onClick={() =>
                                                this.setState({
                                                    yearDropdownOpen: true,
                                                    monthDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <i className="fas fa-caret-down icon__caret" />
                                            {this.renderPrivacy()}
                                        </div>
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            placeholder="Birthday"
                                            type="text"
                                            className="profile--textInput"
                                            value={birthday}
                                            onClick={() =>
                                                this.setState({ birthdaySelection: true })
                                            }
                                        />
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="profile--overview">
                                <p className="profile--displayNameText">{displayName}</p>
                                <p className="profile--handleText">@{handle}</p>
                                <p className="profile--overviewText">{profileOverview}</p>
                                {birthPlace && (
                                    <div className="profile--detailContainer">
                                        <i className="far fa-compass icon__profile" />
                                        <p className="profile--details">{formattedBirthPlace}</p>
                                    </div>
                                )}
                                <div className="profile--detailContainer">
                                    <i className="far fa-calendar-alt icon__profile" />
                                    <p className="profile--details">Joined {dateCreated}</p>
                                </div>
                                {birthday && (
                                    <div className="profile--detailContainer">
                                        <i className="fas fa-birthday-cake icon__profile" />
                                        <p className="profile--details">
                                            Born on {formattedBirthday}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="profile--main">
                            {numTweets === 0 ? (
                                <MyFirstTweet handleDefaultTweet={this.handleDefaultTweet} />
                            ) : (
                                <div className="profile--feedContainer">
                                    <div className="profile--controlsContainer">
                                        <p className="profile--control__active">Tweets</p>
                                        <p className="profile--control">Tweets & replies</p>
                                        <p className="profile--control">Media</p>
                                    </div>
                                    <Feed showFeed={false} />
                                    <div className="profile--footer">
                                        <i className="fab fa-twitter icon__footer" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="profile--trends">
                            <Trends />
                        </div>
                    </div>
                </div>
                {monthDropdownOpen && (
                    <div className="profile--monthDropdown">
                        <div
                            className="profile--dropdownItem"
                            onClick={() => {
                                this.setState({
                                    monthPrivacy: "all",
                                    monthDropdownOpen: false,
                                });
                            }}
                        >
                            <i className="fas fa-globe-americas icon__profilePrivacy profileOverview--dropdownIcon" />
                            <p className="profile--dropdownOption">Public</p>
                        </div>
                        <div
                            className="profile--dropdownItem"
                            onClick={() =>
                                this.setState({
                                    monthPrivacy: "followers",
                                    monthDropdownOpen: false,
                                })
                            }
                        >
                            <i className="fas fa-users icon__profilePrivacy profileOverview--dropdownIcon" />
                            <p className="profile--dropdownOption">Your followers</p>
                        </div>
                        <div
                            className="profile--dropdownItem"
                            onClick={() =>
                                this.setState({
                                    monthPrivacy: "following",
                                    monthDropdownOpen: false,
                                })
                            }
                        >
                            <i className="fas fa-user icon__profilePrivacy profileOverview--dropdownIcon" />
                            <p className="profile--dropdownOption">People you follow</p>
                        </div>
                        <div
                            className="profile--dropdownItem"
                            onClick={() =>
                                this.setState({
                                    monthPrivacy: "both",
                                    monthDropdownOpen: false,
                                })
                            }
                        >
                            <i className="fas fa-exchange-alt icon__profilePrivacy profileOverview--dropdownIcon" />
                            <p className="profile--dropdownOption">You follow each other</p>
                        </div>
                        <div
                            className="profile--dropdownItem"
                            onClick={() =>
                                this.setState({
                                    monthPrivacy: "private",
                                    monthDropdownOpen: false,
                                })
                            }
                        >
                            <i className="fas fa-lock icon__profilePrivacy profileOverview--dropdownIcon" />
                            <p className="profile--dropdownOption">Only you</p>
                        </div>
                        <p className="profileOverview--learnMore">
                            Learn more about these settings
                        </p>
                    </div>
                )}
                {yearDropdownOpen && (
                    <div className="profileOverview--dropdownContainer">
                        <div className="profile--yearDropdown">
                            <div
                                className="profile--dropdownItem"
                                onClick={() => {
                                    this.setState({
                                        yearPrivacy: "all",
                                        yearDropdownOpen: false,
                                    });
                                }}
                            >
                                <i className="fas fa-globe-americas icon__profilePrivacy profileOverview--dropdownIcon" />
                                <p className="profile--dropdownOption">Public</p>
                            </div>
                            <div
                                className="profile--dropdownItem"
                                onClick={() =>
                                    this.setState({
                                        yearPrivacy: "followers",
                                        yearDropdownOpen: false,
                                    })
                                }
                            >
                                <i className="fas fa-users icon__profilePrivacy profileOverview--dropdownIcon" />
                                <p className="profile--dropdownOption">Your followers</p>
                            </div>
                            <div
                                className="profile--dropdownItem"
                                onClick={() =>
                                    this.setState({
                                        yearPrivacy: "following",
                                        yearDropdownOpen: false,
                                    })
                                }
                            >
                                <i className="fas fa-user icon__profilePrivacy profileOverview--dropdownIcon" />
                                <p className="profile--dropdownOption">People you follow</p>
                            </div>
                            <div
                                className="profile--dropdownItem"
                                onClick={() => {
                                    this.setState({
                                        yearPrivacy: "both",
                                        yearDropdownOpen: false,
                                    })
                                }}
                            >
                                <i className="fas fa-exchange-alt icon__profilePrivacy profileOverview--dropdownIcon" />
                                <p className="profile--dropdownOption">You follow each other</p>
                            </div>
                            <div
                                className="profile--dropdownItem"
                                onClick={() =>
                                    this.setState({
                                        yearPrivacy: "private",
                                        yearDropdownOpen: false,
                                    })
                                }
                            >
                                <i className="fas fa-lock icon__profilePrivacy profileOverview--dropdownIcon" />
                                <p className="profile--dropdownOption">Only you</p>
                            </div>
                            <p className="profileOverview--learnMore">
                                Learn more about these settings
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Profile.propTypes = {
    auth: PropTypes.shape({ isVerified: PropTypes.bool, profileImg: PropTypes.string }).isRequired,
    fetchUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(Profile);
