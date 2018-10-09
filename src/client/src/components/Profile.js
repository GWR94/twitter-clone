import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import autosize from "autosize";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import { Tooltip } from "reactstrap";
import * as actions from "../actions";
import NavBar from "./NavBar";
import Trends from "./Trends";
import Feed from "./Feed";
import MyFirstTweet from "./MyFirstTweet";
import twitterLocations from "../services/twitterLocations.json";

class Profile extends React.Component {
    constructor() {
        super();

        this.state = {
            numTweets: 0,
            editMode: false,
            birthdaySelection: false,
            year: null,
            month: null,
            day: null,
            monthPrivacy: "both",
            yearPrivacy: "private",
            monthDropdownOpen: false,
            yearDropdownOpen: false,
            tooltipOpen: false,
            userProfile: true,
            userFollowing: false,
            birthplaceDropdownOpen: false,
            website: "",
        };
    }

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

    async componentWillMount() {
        const { user, getUser, auth, fetchUser, match } = this.props;
        const { handle } = match.params;
        if (handle === auth.handle) {
            await fetchUser();
            const {
                displayName,
                profileOverview,
                website,
                tweets,
                displayImgSrc,
                favouritedTweets,
                retweetedTweets,
                followers,
                following,
                lists,
                moments,
                birthday,
                birthPlace,
                dateCreated,
            } = auth;
            this.setState({
                userProfile: true,
                handle,
                displayName: displayName || "",
                profileOverview: profileOverview || "",
                website,
                tweets,
                displayImgSrc: displayImgSrc || null,
                favouritedTweets,
                retweetedTweets,
                followers,
                following,
                lists,
                moments,
                birthday,
                birthPlace,
                dateCreated,
                numTweets: tweets.length || 0,
            });
        } else {
            if (auth.following.indexOf(handle) > -1) {
                this.setState({ userFollowing: true });
            }
            await getUser(handle);
            const {
                displayName,
                profileOverview,
                website,
                tweets,
                displayImgSrc,
                favouritedTweets,
                retweetedTweets,
                followers,
                following,
                lists,
                moments,
                birthday,
                birthPlace,
                dateCreated,
            } = user;

            this.setState({
                userProfile: false,
                handle,
                displayName: displayName || "",
                profileOverview: profileOverview || "",
                website,
                tweets: tweets || [],
                displayImgSrc: displayImgSrc || null,
                favouritedTweets,
                retweetedTweets,
                followers,
                following,
                lists,
                moments,
                birthday,
                birthPlace,
                dateCreated,
                numTweets: tweets.length || 0,
            });
        }
    }

    searchLocation = name => {
        const results = twitterLocations.filter(
            location => location.name.toLowerCase().indexOf(name.toLowerCase()) > -1,
        );
        return results;
    };

    handleDefaultTweet = async tweet => {
        const { postTweet, auth } = this.props;
        const { numTweets } = this.state;
        await postTweet({
            tweet,
            handle: auth.handle,
            postedAt: Date.now(),
        });
        this.setState({ numTweets: numTweets + 1 });
    };

    /* eslint-disable-next-line */
    renderProfileInfo() {
        const {
            tweets,
            following,
            followers,
            favouritedTweets,
            retweetedTweets,
            lists,
            moments,
        } = this.state;

        const userInfo = [
            {
                description: "Tweets",
                value: tweets && tweets.length,
            },
            {
                description: "Following",
                value: following && following.length,
            },
            {
                description: "Followers",
                value: followers && followers.length,
            },
            {
                description: "Likes",
                value: favouritedTweets && favouritedTweets.length,
            },
            {
                description: "Retweets",
                value: retweetedTweets && retweetedTweets.length,
            },
            {
                description: "Lists",
                value: lists && lists.length,
            },
            {
                description: "Moments",
                value: moments && moments.length,
            },
        ];

        const { editMode } = this.state;
        const filteredInfo = userInfo.filter(info => info.value > 0);
        filteredInfo.push(userInfo[5]); /* Add Lists */
        filteredInfo.push(userInfo[6]); /* Add Moments */

        return filteredInfo.map((info, i) => (
            <div key={i} className={editMode ? "profile--info transparent" : "profile--info"}>
                <p className="profile--infoDescription">{info.description}</p>
                <p className="profile--infoValue">{info.value}</p>
            </div>
        ));
    }

    formatMonth = month => {
        switch (month) {
            case "0":
                return "January";
            case "1":
                return "February";
            case "2":
                return "March";
            case "3":
                return "April";
            case "4":
                return "May";
            case "5":
                return "June";
            case "6":
                return "July";
            case "7":
                return "August";
            case "8":
                return "September";
            case "9":
                return "October";
            case "10":
                return "November";
            case "11":
                return "December";
            default:
                return "Error";
        }
    };

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

    toggleTooltip = () => {
        const { tooltipOpen } = this.state;
        this.setState({ tooltipOpen: !tooltipOpen });
    };

    render() {
        const { auth, user } = this.props;
        const {
            userProfile,
            displayName,
            handle,
            profileOverview,
            website,
            displayImgSrc,
            birthday,
            birthPlace,
            dateCreated,
            numTweets,
            editMode,
            birthdaySelection,
            year,
            month,
            day,
            monthDropdownOpen,
            yearDropdownOpen,
            tooltipOpen,
            userFollowing,
            birthplaceDropdownOpen,
            results,
            monthPrivacy,
            yearPrivacy,
        } = this.state;

        const formattedBirthPlace = (birthPlace && birthPlace.split(",").slice(0, 1)) || "";

        let formattedBirthday = null;
        if (typeof birthday === "object") {
            formattedBirthday =
                `${birthday.monthObj.month} ${birthday.dayObj.day}, ${birthday.yearObj.year}` || "";
        }
        autosize(document.getElementById("profile--bioTextArea"));

        return (
            <div>
                <div className={editMode ? "profile--editBackground" : undefined}>
                    <NavBar transparent={editMode} />
                </div>
                <div
                    className={
                        editMode
                            ? "profile--container profile--editBackground"
                            : "profile--container"
                    }
                >
                    <header className="profile--header" />
                    <div className="profile--infoBottomBorder" />
                    <div className="profile--gridContainer">
                        <div className="profile--imgContainer" id="imgContainer">
                            <i
                                className={
                                    displayImgSrc
                                        ? "icon__hidden fas fa-camera"
                                        : "fas fa-camera icon__addPhotoLarge"
                                }
                            />
                            {displayImgSrc && (
                                <img
                                    src={displayImgSrc}
                                    className="profile--displayImg"
                                    alt="Profile Img"
                                />
                            )}
                            <Tooltip
                                placement="right"
                                isOpen={tooltipOpen}
                                target="imgContainer"
                                toggle={this.toggleTooltip}
                            >
                                Add a profile photo
                            </Tooltip>
                        </div>
                        <div className="profile--information">
                            {this.renderProfileInfo()}
                            {editMode ? (
                                <div className="profile--buttonContainer">
                                    <button
                                        className="button__themeColor"
                                        type="button"
                                        onClick={() => this.setState({ editMode: false })}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="button__lightBlue"
                                        type="button"
                                        onClick={async () => {
                                            const values = [
                                                {
                                                    field: "birthPlace",
                                                    value: birthPlace,
                                                    user: auth.handle,
                                                },
                                                {
                                                    field: "displayName",
                                                    value: displayName,
                                                    user: auth.handle,
                                                },
                                                {
                                                    field: "birthday",
                                                    value: {
                                                        dayObj: {
                                                            day,
                                                            dayPrivacy: monthPrivacy,
                                                        },
                                                        monthObj: {
                                                            month: this.formatMonth(month),
                                                            monthPrivacy,
                                                        },
                                                        yearObj: {
                                                            year,
                                                            yearPrivacy,
                                                        },
                                                    },
                                                    user: auth.handle,
                                                },
                                                {
                                                    field: "profileOverview",
                                                    value: profileOverview,
                                                    user: auth.handle,
                                                },
                                                {
                                                    field: "website",
                                                    value: website,
                                                    user: auth.handle,
                                                },
                                            ];

                                            const { updateProfile } = this.props;
                                            await updateProfile(values);
                                            this.setState({ editMode: false });
                                        }}
                                    >
                                        Save changes
                                    </button>
                                </div>
                            ) : userProfile ? (
                                <div className="profile--buttonContainer">
                                    <button
                                        className="button__themeColor"
                                        type="button"
                                        onClick={() => this.setState({ editMode: true })}
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            ) : (
                                <button
                                    className="button__themeColor"
                                    type="button"
                                    onClick={async () => {
                                        const { followUser } = this.props;
                                        await followUser({
                                            action: userFollowing ? "unfollow" : "follow",
                                            currentUser: auth.handle,
                                            userToFollow: user.handle,
                                        });
                                        const newState = !userFollowing;
                                        this.setState({ userFollowing: newState });
                                    }}
                                >
                                    {userFollowing ? "Unfollow" : "Follow"}
                                </button>
                            )}
                        </div>
                        {editMode ? (
                            <div
                                className={
                                    birthdaySelection
                                        ? "profile--overviewEditBirthday"
                                        : "profile--overviewEditMode"
                                }
                            >
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
                                    value={profileOverview}
                                    onChange={e =>
                                        this.setState({ profileOverview: e.target.value })
                                    }
                                />
                                <input
                                    placeholder="Location"
                                    type="text"
                                    className="profile--textInput"
                                    value={birthPlace}
                                    onChange={e => {
                                        const searchResults = this.searchLocation(e.target.value);
                                        searchResults.sort((a, b) => {
                                            if (a.name > b.name) return 1;
                                            if (a.name < b.name) return -1;
                                            return 0;
                                        });
                                        this.setState({
                                            birthplaceDropdownOpen: true,
                                            results: searchResults.slice(0, 5),
                                            birthPlace: e.target.value,
                                        });
                                    }}
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
                                            onClick={() => {
                                                const newState = !monthDropdownOpen;
                                                this.setState({
                                                    monthDropdownOpen: newState,
                                                    yearDropdownOpen: false,
                                                });
                                            }}
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
                                            onClick={() => {
                                                const newState = !yearDropdownOpen;
                                                this.setState({
                                                    yearDropdownOpen: newState,
                                                    monthDropdownOpen: false,
                                                });
                                            }}
                                        >
                                            <i className="fas fa-caret-down icon__caret" />
                                            {this.renderPrivacy()}
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
                                                    <p className="profile--dropdownOption">
                                                        Public
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        Your followers
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        People you follow
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        You follow each other
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        Only you
                                                    </p>
                                                </div>
                                                <p className="profileOverview--learnMore">
                                                    Learn more about these settings
                                                </p>
                                            </div>
                                        )}
                                        {yearDropdownOpen && (
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
                                                    <p className="profile--dropdownOption">
                                                        Public
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        Your followers
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        People you follow
                                                    </p>
                                                </div>
                                                <div
                                                    className="profile--dropdownItem"
                                                    onClick={() => {
                                                        this.setState({
                                                            yearPrivacy: "both",
                                                            yearDropdownOpen: false,
                                                        });
                                                    }}
                                                >
                                                    <i className="fas fa-exchange-alt icon__profilePrivacy profileOverview--dropdownIcon" />
                                                    <p className="profile--dropdownOption">
                                                        You follow each other
                                                    </p>
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
                                                    <p className="profile--dropdownOption">
                                                        Only you
                                                    </p>
                                                </div>
                                                <p className="profileOverview--learnMore">
                                                    Learn more about these settings
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            placeholder="Birthday"
                                            type="text"
                                            className="profile--textInput"
                                            value={formattedBirthday}
                                            onClick={() =>
                                                this.setState({ birthdaySelection: true })
                                            }
                                        />
                                    </div>
                                )}
                                {birthplaceDropdownOpen &&
                                    results.length > 0 && (
                                        <div className="profile--birthplaceDropdown">
                                            {results.map(result => {
                                                const place = `${result.name}, ${result.country}`;
                                                return (
                                                    <div
                                                        className="profile--searchResult"
                                                        onClick={async () => {
                                                            this.setState({
                                                                birthPlace: place,
                                                                birthplaceDropdownOpen: false,
                                                            });
                                                        }}
                                                    >
                                                        {place}
                                                    </div>
                                                );
                                            })}
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
                        <div className={editMode ? "profile--main transparent" : "profile--main"}>
                            {userProfile && numTweets === 0 ? (
                                <MyFirstTweet handleDefaultTweet={this.handleDefaultTweet} />
                            ) : (
                                <div className="profile--feedContainer">
                                    <div className="profile--controlsContainer">
                                        <p className="profile--control__active">Tweets</p>
                                        <p className="profile--control">Tweets & replies</p>
                                        <p className="profile--control">Media</p>
                                    </div>
                                    <Feed
                                        userProfile={userProfile}
                                        handle={user ? user.handle : auth.handle}
                                        showFeed={false}
                                    />
                                    <div className="profile--footer">
                                        <i className="fab fa-twitter icon__footer" />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div
                            className={editMode ? "profile--trends transparent" : "profile--trends"}
                        >
                            <Trends />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Profile.propTypes = {
    auth: PropTypes.shape({ isVerified: PropTypes.bool, profileImg: PropTypes.string }).isRequired,
    fetchUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth, user }) => ({ auth, user });

export default connect(
    mapStateToProps,
    actions,
)(Profile);
