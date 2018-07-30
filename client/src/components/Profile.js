import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";

class Profile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        const {auth} = this.props;

        return (
            <div>
                <div className="profile--header">
                    <div className="profile--headerContainer">
                        <img className="profile--headerImg" src={auth.headerImg} alt="Header Img"/>
                    </div>
                    <img src={auth.profileImg} className="profile--displayImg" alt="Display Img"/>
                    <div className="profile--nameContainer">
                        <h5 className="profile--name">JG
                            <span role="img" aria-label="emoji">🦁🦁🦁</span>
                        </h5>
                        <h6 className="profile--handle">@{auth.username}</h6>
                    </div>
                    <div className="profile--followingsContainer">
                        <div className="profile--tweets">
                            <h6 className="profile--names">Tweets</h6>
                            <h4 className="profile--numbers">
                                {Number(0).toLocaleString()}
                            </h4>
                        </div>
                        <div className="profile--following">
                            <h6 className="profile--names">Following</h6>
                            <h4 className="profile--numbers">
                                {Number(0).toLocaleString()}
                            </h4>
                        </div>
                        <div className="profile--followers">
                            <h6 className="profile--names">Followers</h6>
                            <h4 className="profile--numbers">
                                {Number(0).toLocaleString()}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}

const mapStateToProps = ({auth}) => ({auth});

Profile.propTypes = {
    auth: PropTypes
        .shape({isVerified: PropTypes.bool, profileImg: PropTypes.string})
        .isRequired
}

export default connect(mapStateToProps)(Profile);