import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import autosize from "autosize";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import { Tooltip } from "reactstrap";
import validator from "validator";
import { Croppie } from "croppie";
import Modal from "react-modal";
import * as actions from "../actions";
import Cropper from "./Cropper";
import NavBar from "./NavBar";
import Trends from "./Trends";
import Feed from "./Feed";
import MyFirstTweet from "./MyFirstTweet";
import formatMonth from "../services/formatMonth";
import searchLocation from "../services/searchLocation";
import "croppie/croppie.css";

class Profile extends React.Component {
    constructor() {
        super();
        this.cropperRef = React.createRef();

        this.state = {
            numTweets: 0,
            editMode: false,
            birthdaySelection: false,
            monthPrivacy: "both",
            yearPrivacy: "private",
            monthDropdownOpen: false,
            yearDropdownOpen: false,
            tooltipOpen: false,
            userProfile: true,
            userFollowing: false,
            birthplaceDropdownOpen: false,
            website: "",
            websiteErrorOpen: false,
            birthdayCheckModalOpen: false,
            active: "Tweets",
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
        [x] Set birthday dropdowns to be default values
        [x] Add active border for Tweets / current active toggle
    */

    async componentWillMount() {
        const { user, getUser, auth, match } = this.props;
        const { handle } = match.params;
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
        } = handle === auth.handle ? auth : user;

        if (handle !== auth.handle) {
            if (auth.following.indexOf(handle) > -1) {
                this.setState({ userFollowing: true });
            } else {
                this.setState({ userFollowing: false });
            }
            await getUser(handle);
        }

        document.title = `${displayName} (@${handle}) | Twitter`;

        this.setState({
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
            birthday: `${birthday.monthObj.month} ${birthday.dayObj.day}, ${birthday.yearObj.year}`,
            month: birthday.monthObj.month,
            day: birthday.dayObj.day,
            year: birthday.yearObj.year,
            birthPlace,
            dateCreated,
            numTweets: tweets.length || 0,
            rendered: true,
            uploadDropdownOpen: true,
        });
    }

    closeModal = () => {
        this.setState({
            birthdayCheckModalOpen: false,
            imgModalOpen: false,
            img: undefined
        });
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
            active,
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
            <div
                key={i}
                className={
                    editMode
                        ? "profile--info transparent"
                        : active === info.description
                            ? "profile--infoActive"
                            : "profile--info"
                }
            >
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

    toggleTooltip = () => {
        const { tooltipOpen } = this.state;
        this.setState({ tooltipOpen: !tooltipOpen });
    };

    onImageChange = e => {
        const { img } = this.state;
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = ev => {
                this.setState({ img: ev.target.result });
            };
            reader.readAsDataURL(e.target.files[0]);
        }
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
            rendered,
            websiteErrorOpen,
            birthdayErrorOpen,
            birthdayCheckModalOpen,
            tweets,
            uploadDropdownOpen,
            img,
            imgModalOpen,
        } = this.state;

        const modalStyles = {
            content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "520px",
                padding: "0",
            },
        };

        const formattedBirthPlace = (birthPlace && birthPlace.split(",").slice(0, 1)) || "";

        autosize(document.getElementById("profile--bioTextArea"));

        if (!rendered) {
            return <div />;
        }

        return (
            <div>
                <div className={editMode ? "profile--editBackground" : undefined}>
                    <NavBar transparent={editMode} />
                </div>
                {websiteErrorOpen && (
                    <div className="profile--errorBox">
                        <div className="profile--errorCloseIcon">
                            <i
                                className="fas fa-times"
                                onClick={() => this.setState({ websiteErrorOpen: false })}
                            />
                        </div>
                        Url is not valid
                    </div>
                )}
                {birthdayErrorOpen && (
                    <div className="profile--errorBox">
                        <div className="profile--errorCloseIcon">
                            <i
                                className="fas fa-times"
                                onClick={() => this.setState({ birthdayErrorOpen: false })}
                            />
                        </div>
                        Please enter a valid birthday
                    </div>
                )}
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
                        {uploadDropdownOpen && (
                            <div className="profile--uploadDropdown">
                                <input
                                    type="file"
                                    hidden
                                    id="fileUpload"
                                    onChange={this.onImageChange.bind(this)}
                                />
                                <p
                                    onClick={() => {
                                        document.getElementById("fileUpload").click();
                                        this.setState({ imgModalOpen: true });
                                    }}
                                >
                                    Upload photo
                                </p>
                                <p>Remove</p>
                                <hr />
                                <p>Cancel</p>
                            </div>
                        )}
                        <Modal
                            isOpen={imgModalOpen && img}
                            style={modalStyles}
                            contentLabel="Position and size your photo"
                            onRequestClose={this.closeModal}
                            appElement={document.getElementById("app")}
                        >
                            <Cropper img={img} closeModal={this.closeModal}/>
                        </Modal>

                        <div className="profile--imgContainer" id="imgContainer">
                            {editMode ? (
                                <div className="profile--imgInnerContainer">
                                    {displayImgSrc && (
                                        <img
                                            src={displayImgSrc}
                                            className="profile--displayImg"
                                            alt="Profile Img"
                                            onClick={() =>
                                                this.setState({ uploadDropdownOpen: true })
                                            }
                                        />
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <i
                                        className={
                                            !displayImgSrc && "fa-camera icon__addPhotoLarge"
                                        }
                                    />
                                    {displayImgSrc && (
                                        <img
                                            src={displayImgSrc}
                                            className="profile--displayImg"
                                            alt="Profile Img"
                                        />
                                    )}
                                </div>
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
                                            if (!validator.isURL(website)) {
                                                return this.setState({ websiteErrorOpen: true });
                                            }
                                            if (
                                                typeof day !== "string" ||
                                                typeof month !== "string" ||
                                                typeof year !== "string"
                                            ) {
                                                return this.setState({ birthdayErrorOpen: true });
                                            }
                                            const currentBirthday = `${month} ${day}, ${year}`;
                                            if (birthday !== currentBirthday) {
                                                return this.setState({
                                                    birthdayCheckModalOpen: true,
                                                });
                                            }
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
                                                            month,
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
                                            return this.setState({
                                                editMode: false,
                                                birthday: `${month} ${day}, ${year}`,
                                                birthdaySelection: false,
                                            });
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
                                        const searchResults = searchLocation(e.target.value);
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
                                <Modal
                                    isOpen={birthdayCheckModalOpen}
                                    style={modalStyles}
                                    contentLabel="Confirm birth date"
                                    onRequestClose={this.closeModal}
                                    appElement={document.getElementById("app")}
                                >
                                    <h2 className="profile--modalTitle">Confirm birth date</h2>
                                    <p className="profile--modalText">
                                        You are confirming that the birth date you entered, {month}{" "}
                                        {day}, {year}, is accurate. If it’s not, your account may be
                                        affected.
                                    </p>
                                    <div className="profile--modalButtonContainer">
                                        <button
                                            className="button__themeColor"
                                            type="button"
                                            onClick={this.closeModal}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="button__confirm"
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
                                                                month,
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
                                                this.closeModal();
                                                this.setState({
                                                    editMode: false,
                                                    birthday: `${month} ${day}, ${year}`,
                                                    birthdaySelection: false,
                                                });
                                            }}
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </Modal>
                                {birthdaySelection ? (
                                    <div style={{ marginTop: "10px" }}>
                                        <p className="profile--birthdayText">Birthday</p>
                                        <p className="profile--birthdayText">
                                            This should be your date of birth, whether this account
                                            is for your business, event, or even your cat.
                                        </p>
                                        <MonthPicker
                                            defaultValue={month || "Month"}
                                            onChange={newMonth => {
                                                this.setState({
                                                    month: formatMonth(newMonth),
                                                });
                                            }}
                                            optionClasses="profileOverview--monthContainer"
                                            classes="profileOverview--dropdown"
                                            day={day}
                                        />
                                        <DayPicker
                                            onChange={newDay => {
                                                this.setState({ day: newDay });
                                            }}
                                            defaultValue={day || "Day"}
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
                                            reverse
                                            onChange={newYear => {
                                                this.setState({ year: newYear });
                                            }}
                                            defaultValue={year || "Year"}
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
                                            readOnly
                                            defaultValue={birthday || ""}
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
                                {website && (
                                    <div className="profile--detailContainer">
                                        <i className="fas fa-link icon__profile" />
                                        <a className="profile--link" href={website}>
                                            {website}
                                        </a>
                                    </div>
                                )}
                                <div className="profile--detailContainer">
                                    <i className="far fa-calendar-alt icon__profile" />
                                    <p className="profile--details">Joined {dateCreated}</p>
                                </div>
                                {birthday && (
                                    <div className="profile--detailContainer">
                                        <i className="fas fa-birthday-cake icon__profile" />
                                        <p className="profile--details">Born on {birthday}</p>
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
                                        profileTweets={tweets}
                                        showFeed={false}
                                        showPinned
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
    user: PropTypes.shape({}),
};

Profile.defaultProps = {
    user: null,
};

const mapStateToProps = ({ auth, user }) => ({ auth, user });

export default connect(
    mapStateToProps,
    actions,
)(Profile);
