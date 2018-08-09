import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";
import defaultHeaderImg from "../../../../public/images/headerPlaceholder.jpg";

class ProfileOverview extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
     
    render() {
        const { auth, tweets, history } = this.props;
        const { handle, displayName, displayImgSrc, headerImgSrc, following, followers } = auth;

        return (
            <div className="profileOverview--header">
                <div className="profileOverview--headerContainer">
                    <img
                        className="profileOverview--headerImg"
                        src={headerImgSrc || defaultHeaderImg}
                        alt="Header Img"
                    />
                </div>
                <img
                    src={displayImgSrc || defaultDisplayImg}
                    className="profileOverview--displayImg"
                    alt="Display Img"
                />
                <div className="profileOverview--nameContainer">
                    <h5 className="profileOverview--name">{displayName}</h5>
                    <h6 className="profileOverview--handle">@{handle}</h6>
                </div>
                <div className="profileOverview--followingsContainer">
                    <div className="profileOverview--tweets">
                        <h6 className="profileOverview--names">Tweets</h6>
                        <h4 className="profileOverview--numbers">
                            {Number(tweets.length).toLocaleString()}
                        </h4>
                    </div>
                    <div className="profileOverview--following">
                        <h6 className="profileOverview--names">Following</h6>
                        <h4 className="profileOverview--numbers">
                            {Number(following.length).toLocaleString()}
                        </h4>
                    </div>
                    <div className="profileOverview--followers">
                        <h6 className="profileOverview--names">Followers</h6>
                        <h4 className="profileOverview--numbers">
                            {Number(followers.length).toLocaleString()}
                        </h4>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = ({ auth, tweets }) => ({ auth, tweets });

ProfileOverview.propTypes = {
    auth: PropTypes.shape({ isVerified: PropTypes.bool, profileImg: PropTypes.string }).isRequired,
    tweets: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default connect(mapStateToProps)(ProfileOverview);
