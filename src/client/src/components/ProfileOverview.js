import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Tooltip } from "reactstrap";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";
import CropViewer from "rc-cropping";
import Dialog from "rc-dialog";
import Upload from "rc-upload";
import * as actions from "../actions";
import twitterLocations from "../services/twitterLocations.json";
import oneHundred from "../../../../public/images/oneHundred.png";
import "rc-cropping/assets/index.css";
import "rc-dialog/assets/index.css";

/*
    TODO
    [ ] Add functionality to upload display image.
    [ ] Fix searchLocation results
    [ ] Check positioning for dropdown boxes
*/

class ProfileOverview extends React.Component {
    constructor() {
        super();
        this.displayRef = React.createRef();

        this.state = {
            percent: 30,
            showInfo: "displayImg",
            year: null,
            month: null,
            day: null,
            monthPrivacy: "both",
            yearPrivacy: "private",
            monthDropdownOpen: false,
            yearDropdownOpen: false,
            profileCompleted: false,
            tooltipOpen: false,
        };
    }

    componentDidMount() {
        const { auth } = this.props;
        const { profileCompleted } = auth;
        if (profileCompleted) this.setState({ profileCompleted: true });
    }

    onModalClose = () => {
        this.setState({ modalIsOpen: false });
    };

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

    searchLocation = name => {
        const results = twitterLocations.filter(
            location => location.name.toLowerCase().indexOf(name.toLowerCase()) > -1,
        );
        return results;
    };

    beforeUpload(file) {
        const cropper = this.cropper;
        console.log(">> cropper", this.cropper);
        return cropper.selectImage(file).then(image => {
            console.log(">> selecTImage", image);
            return image;
        });
    }

    handleImageChange(e) {
        const { imagePreviewUrl } = this.state;
        e.preventDefault();

        const reader = new FileReader();
        const file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                file,
                imagePreviewUrl: reader.result,
                modalIsOpen: true,
            });
        };
        reader.readAsDataURL(file);
    }

    toggleTooltip = () => {
        const { tooltipOpen } = this.state;
        this.setState({ tooltipOpen: !tooltipOpen });
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

    render() {
        const { auth, tweets, updateProfile } = this.props;
        const {
            percent,
            profileText,
            showInfo,
            year,
            yearPrivacy,
            month,
            monthPrivacy,
            day,
            monthDropdownOpen,
            yearDropdownOpen,
            birthplaceDropdownOpen,
            results,
            birthplace,
            profileCompleted,
            uploadImageDropdownOpen,
            modalIsOpen,
            imagePreviewUrl,
            tooltipOpen,
        } = this.state;

        let imagePreview = null;
        if (imagePreviewUrl) {
            imagePreview = <img alt="Profile Img" src={imagePreviewUrl} />;
        } else {
            imagePreview = <div className="previewText">Please select an image to upload</div>;
        }

        const { handle, displayName, displayImgSrc, headerImgSrc, following, followers } = auth;

        const progressBar = (
            <div>
                <div className="progress" style={{ height: "10px", marginTop: "14px" }}>
                    <div
                        className="progress-bar"
                        style={{ width: `${percent}%`, background: "#17BF63" }}
                    />
                </div>
                <p className="profileOverview--barText">{`${percent}% complete`}</p>
            </div>
        );

        return (
            <div>
                <div className="profileOverview--header">
                    <div className="profileOverview--headerContainer">
                        {headerImgSrc && (
                            <img
                                className="profileOverview--headerImg"
                                src={headerImgSrc}
                                alt="Header Img"
                            />
                        )}
                    </div>
                    <i
                        className={
                            displayImgSrc
                                ? "icon__hidden fas fa-camera"
                                : "fas fa-camera icon__addPhoto"
                        }
                        onMouseEnter={() => {
                            this.displayRef.current.classList.add("profileOverview--hover");
                            this.setState({ tooltipOpen: true });
                        }}
                        onMouseLeave={() => {
                            this.displayRef.current.classList.remove("profileOverview--hover");
                            this.setState({ tooltipOpen: false });
                        }}
                    />
                    <div
                        className="profileOverview--displayImgContainer"
                        id="displayImg"
                        ref={this.displayRef}
                        onMouseEnter={() => {
                            this.setState({ tooltipOpen: true });
                        }}
                        onMouseLeave={() => {
                            this.setState({ tooltipOpen: false });
                        }}
                    >
                        {displayImgSrc && (
                            <img
                                src={displayImgSrc}
                                className="profileOverview--displayImg"
                                alt="Display Img"
                                onClick={() => this.setState({ uploadImageDropdownOpen: true })}
                            />
                        )}
                    </div>
                    <Tooltip
                        target="displayImg"
                        placement="top"
                        isOpen={tooltipOpen}
                    >
                        Add a profile photo
                    </Tooltip>

                    <div className="profileOverview--nameContainer">
                        <Link to={`/profile/${handle}`} className="profileOverview--name">
                            {displayName}
                        </Link>
                        <Link to={`/profile/${handle}`} className="profileOverview--handle">
                            @{handle}
                        </Link>
                    </div>
                    <div className="profileOverview--followingsContainer">
                        <div className="profileOverview--tweets">
                            <h6 className="profileOverview--names">Tweets</h6>
                            <h4 className="profileOverview--numbers">
                                {Number(tweets.length).toLocaleString()}
                            </h4>
                        </div>
                        {following.length > 0 && (
                            <div className="profileOverview--following">
                                <h6 className="profileOverview--names">Following</h6>
                                <h4 className="profileOverview--numbers">
                                    {Number(following.length).toLocaleString()}
                                </h4>
                            </div>
                        )}
                        {followers.length > 0 && (
                            <div className="profileOverview--followers">
                                <h6 className="profileOverview--names">Followers</h6>
                                <h4 className="profileOverview--numbers">
                                    {Number(followers.length).toLocaleString()}
                                </h4>
                            </div>
                        )}
                    </div>
                </div>
                {!profileCompleted && (
                    <div className="profileOverview--completeProfileContainer">
                        {showInfo === "displayImg" && (
                            <div className="profileOverview--addImageContainer">
                                <p className="profileOverview--completeTitle">
                                    Pick a profile photo
                                </p>
                                <p className="profileOverview--completeText">
                                    Have a favourite selfie? Upload it now.
                                </p>
                                {progressBar}
                                <div
                                    className="profileOverview--photoButtonContainer"
                                    style={{ left: "110px" }}
                                >
                                    <button
                                        className="btn button__skip"
                                        type="button"
                                        onClick={() => {
                                            const currentPercent = percent + 18;
                                            this.setState({
                                                percent: currentPercent,
                                                showInfo: "profile",
                                            });
                                        }}
                                    >
                                        Skip
                                    </button>

                                    <button
                                        type="button"
                                        className="btn button__twitterBlue"
                                        onClick={() => {
                                            this.setState({ uploadImageDropdownOpen: true });
                                        }}
                                    >
                                        Add a photo
                                    </button>
                                </div>
                            </div>
                        )}
                        {showInfo === "profile" && (
                            <div className="profileOverview--overview">
                                <p className="profileOverview--completeTitle">Introduce yourself</p>
                                <p className="profileOverview--completeText">
                                    Describe who you are and what you&#39;re into.
                                </p>
                                <textarea
                                    className="profileOverview--textArea"
                                    onChange={e => {
                                        this.setState({ profileText: e.target.value });
                                    }}
                                />
                                {progressBar}
                                <div
                                    className="profileOverview--photoButtonContainer"
                                    style={{ left: "160px" }}
                                >
                                    <button
                                        className="btn button__skip"
                                        type="button"
                                        onClick={() => {
                                            this.setState({
                                                percent: percent + 17,
                                                showInfo: "birthday",
                                            });
                                        }}
                                    >
                                        Skip
                                    </button>
                                    <button
                                        className="btn button__twitterBlue"
                                        type="button"
                                        disabled={!profileText}
                                        onClick={async () => {
                                            const values = {
                                                field: "profileOverview",
                                                value: profileText,
                                                user: handle,
                                            };
                                            updateProfile(values);
                                            this.setState({
                                                percent: percent + 17,
                                                showInfo: "birthday",
                                            });
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                        {showInfo === "birthday" && (
                            <div className="profileOverview--birthdayContainer">
                                <p className="profileOverview--completeTitle">Add your birthday</p>
                                <p className="profileOverview--completeText">
                                    Let Twitter celebrate with you. You&#39;re always in control of
                                    who can see it.
                                </p>
                                <p className="profileOverview--completeSubText">
                                    This should be your date of birth, whether this account is for
                                    your business, event, or even your cat.
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
                                {progressBar}
                                <div
                                    className="profileOverview--photoButtonContainer"
                                    style={{ left: "160px", top: "-10px" }}
                                >
                                    <button
                                        className="btn button__skip"
                                        type="button"
                                        onClick={() => {
                                            this.setState({
                                                percent: percent + 17,
                                                showInfo: "birthplace",
                                            });
                                        }}
                                    >
                                        Skip
                                    </button>
                                    <button
                                        className="btn button__twitterBlue"
                                        type="button"
                                        disabled={!year || !month || !day}
                                        onClick={async () => {
                                            const values = {
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
                                                user: handle,
                                            };
                                            await updateProfile(values);
                                            this.setState({
                                                percent: percent + 18,
                                                showInfo: "birthplace",
                                            });
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                                {monthDropdownOpen && (
                                    <div className="profileOverview--monthDropdown">
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() => {
                                                this.setState({
                                                    monthPrivacy: "all",
                                                    monthDropdownOpen: false,
                                                });
                                            }}
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                Public
                                            </p>
                                            <i className="fas fa-globe-americas icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    monthPrivacy: "followers",
                                                    monthDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                Your followers
                                            </p>
                                            <i className="fas fa-users icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    monthPrivacy: "following",
                                                    monthDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                People you follow
                                            </p>
                                            <i className="fas fa-user icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    monthPrivacy: "both",
                                                    monthDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                You follow each other
                                            </p>
                                            <i className="fas fa-exchange-alt icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    monthPrivacy: "private",
                                                    monthDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                Only you
                                            </p>
                                            <i className="fas fa-lock icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <p className="profileOverview--learnMore">
                                            Learn more about these settings
                                        </p>
                                    </div>
                                )}
                                {yearDropdownOpen && (
                                    <div className="profileOverview--yearDropdown">
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() => {
                                                this.setState({
                                                    yearPrivacy: "all",
                                                    yearDropdownOpen: false,
                                                });
                                            }}
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                Public
                                            </p>
                                            <i className="fas fa-globe-americas icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    yearPrivacy: "followers",
                                                    yearDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                Your followers
                                            </p>
                                            <i className="fas fa-users icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    yearPrivacy: "following",
                                                    yearDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                People you follow
                                            </p>
                                            <i className="fas fa-user icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    yearPrivacy: "both",
                                                    yearDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                You follow each other
                                            </p>
                                            <i className="fas fa-exchange-alt icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <div
                                            className="profileOverview--dropdownItem"
                                            onClick={() =>
                                                this.setState({
                                                    yearPrivacy: "private",
                                                    yearDropdownOpen: false,
                                                })
                                            }
                                        >
                                            <p className="profileOverview--dropdownOption">
                                                Only you
                                            </p>
                                            <i className="fas fa-lock icon__profilePrivacy profileOverview--dropdownIcon" />
                                        </div>
                                        <p className="profileOverview--learnMore">
                                            Learn more about these settings
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        {showInfo === "birthplace" && (
                            <div className="profileOverview--birthplaceContainer">
                                <p className="profileOverview--completeTitle">Where do you live?</p>
                                <p className="profileOverview--completeText">
                                    Find people in the same location as you.
                                </p>
                                <textarea
                                    className="profileOverview--textArea"
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
                                            birthplace: e.target.value,
                                        });
                                    }}
                                    value={birthplace}
                                />
                                {progressBar}
                                <div
                                    className="profileOverview--photoButtonContainer"
                                    style={{ left: "160px", top: "-10px" }}
                                >
                                    <button
                                        className="btn button__skip"
                                        type="button"
                                        onClick={async () => {
                                            this.setState({
                                                percent: percent + 18,
                                                showInfo: "completed",
                                            });
                                            const profileComplete = {
                                                field: "profileCompleted",
                                                value: true,
                                                user: handle,
                                            };
                                            await updateProfile(profileComplete);
                                        }}
                                    >
                                        Skip
                                    </button>
                                    <button
                                        className="btn button__twitterBlue"
                                        type="button"
                                        disabled={!birthplace}
                                        onClick={async () => {
                                            const values = {
                                                field: "birthPlace",
                                                value: birthplace,
                                                user: handle,
                                            };
                                            const profileComplete = {
                                                field: "profileCompleted",
                                                value: true,
                                                user: handle,
                                            };
                                            await updateProfile(values);
                                            await updateProfile(profileComplete);
                                            this.setState({ showInfo: "completed" });
                                        }}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        )}
                        {showInfo === "completed" && (
                            <div className="profileOverview--completedContainer">
                                <div className="profileOverview--closeIconContainer">
                                    <i
                                        className="fas fa-times"
                                        onClick={() => this.setState({ profileCompleted: true })}
                                    />
                                </div>
                                <img
                                    alt="100 emoji"
                                    src={oneHundred}
                                    className="profileOverview--oneHundredImg"
                                />
                                <h3 className="profileOverview--completeLargeText">
                                    Awesome - Your profile is complete! You can always make changes
                                    later.
                                </h3>
                                <Link
                                    className="btn button__twitterBlue"
                                    to={`/profile/${handle}`}
                                    style={{
                                        margin: "10px auto 6px auto",
                                        display: "block",
                                        width: "114px",
                                        textAlign: "center",
                                    }}
                                >
                                    See my profile
                                </Link>
                            </div>
                        )}
                    </div>
                )}
                {birthplaceDropdownOpen &&
                    results.length > 0 && (
                        <div className="profileOverview--birthplaceDropdown">
                            {results.map(result => {
                                const place = `${result.name}, ${result.country}`;
                                return (
                                    <div
                                        className="profileOverview--searchResult"
                                        onClick={async () => {
                                            this.setState({
                                                birthplace: place,
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
                {uploadImageDropdownOpen && (
                    <div className="profileOverview--uploadImageDropdown">
                        <form action="/api/upload" method="POST" id="formUpload">
                            <input
                                type="file"
                                name="file"
                                id="file"
                                className="profileOverview--fileInput"
                                tabIndex="-1"
                                title="Add Photo"
                                accept="image/gif,image/jpeg,image/jpg,image/png"
                                onChange={e => {
                                    this.handleImageChange(e);
                                }}
                            />
                            <p
                                className="profileOverview--dropdownItem"
                                onClick={() => document.getElementById("file").click()}
                            >
                                Upload photo
                            </p>
                            <Upload type="drag" beforeUpload={this.beforeUpload} />
                            <button
                                type="submit"
                                value="submit"
                                id="submitUpload"
                                style={{ display: "none" }}
                            />
                        </form>

                        <hr className="profileOverview--seperator" />
                        <p className="profileOverview--dropdownItem">Cancel</p>
                    </div>
                )}
                {modalIsOpen && (
                    <CropViewer
                        getSpinContent={() => <span>loading...</span>}
                        renderModal={() => <Dialog />}
                        circle
                        locale="en-US"
                        ref={ele => {
                            this.cropper = ele;
                        }}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = ({ auth, tweets }) => ({ auth, tweets });

ProfileOverview.propTypes = {
    auth: PropTypes.shape({ isVerified: PropTypes.bool, profileImg: PropTypes.string }).isRequired,
    tweets: PropTypes.arrayOf(PropTypes.object).isRequired,
    updateProfile: PropTypes.func.isRequired,
};

export default connect(
    mapStateToProps,
    actions,
)(ProfileOverview);
