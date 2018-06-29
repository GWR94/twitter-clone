import React from 'react';
import {connect} from 'react-redux';

class Profile extends React.Component {
    constructor() {
        super();

        this.state = {};
    }
    render() {
        return (
            <div>
                <div className="profile--header">
                    <div className="profile--headerContainer">
                        <img className="profile--headerImg" src={this.props.auth.headerImg}/>
                    </div>
                    <img src={this.props.auth.profileImg} className="profile--displayImg"/>
                    <div className="profile--nameContainer">
                        <h5 className="profile--name">JG 🦁🦁🦁</h5>
                        <h6 className="profile--handle">@{this.props.auth.username}</h6>
                    </div>
                    <div className="profile--followingsContainer">
                        <div className="profile--tweets">
                            <h6 className="profile--names">Tweets</h6>
                            <h4 className="profile--numbers">
                                {Number(6395).toLocaleString()}
                            </h4>
                        </div>
                        <div className="profile--following">
                            <h6 className="profile--names">Following</h6>
                            <h4 className="profile--numbers">
                                {Number(269).toLocaleString()}
                            </h4>
                        </div>
                        <div className="profile--followers">
                            <h6 className="profile--names">Followers</h6>
                            <h4 className="profile--numbers">
                                {Number(2148).toLocaleString()}
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return {auth}
}

export default connect(mapStateToProps)(Profile);