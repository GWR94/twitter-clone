import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";
import defaultHeaderImg from "../../../../public/images/headerPlaceholder.jpg";

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const {auth, tweets} = this.props;
        const {handle, displayName, displayImgSrc, headerImgSrc, following, followers} = auth;
        // ? Add isVerfied later.
        console.log(followers);

        return (
            <div>
                <div className="profile--header">
                    <div className="profile--headerContainer">
                        <img className="profile--headerImg" src={headerImgSrc || defaultHeaderImg} alt="Header Img"/>
                    </div>
                    <img src={displayImgSrc || defaultDisplayImg} className="profile--displayImg" alt="Display Img"/>
                    <div className="profile--nameContainer">
                        <h5 className="profile--name">{displayName}</h5>
                        <h6 className="profile--handle">@{handle}</h6>
                    </div>
                    <div className="profile--followingsContainer">
                        <div className="profile--tweets">
                            <h6 className="profile--names">Tweets</h6>
                            <h4 className="profile--numbers">
                                {Number(tweets.length).toLocaleString()}
                            </h4>
                        </div>
                        <div className="profile--following">
                            <h6 className="profile--names">Following</h6>
                            <h4 className="profile--numbers">
                                {Number(following.length).toLocaleString()}
                            </h4>
                        </div>
                        <div className="profile--followers">
                            <h6 className="profile--names">Followers</h6>
                            <h4 className="profile--numbers">
                                {Number(followers.length).toLocaleString()}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = ({auth, tweets}) => ({auth, tweets});

Profile.propTypes = {
    auth: PropTypes
        .shape({isVerified: PropTypes.bool, profileImg: PropTypes.string})
        .isRequired
}

export default connect(mapStateToProps)(Profile);