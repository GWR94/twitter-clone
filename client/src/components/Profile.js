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
                    <img className="profile--headerImg"/>
                    <img src={this.props.auth.photo} className="profile--displayImg"/>
                    <div className="profile--nameContainer">
                        <h5 className="profile--name">Name</h5>
                        <h6 className="profile--handle">@{this.props.auth.username}</h6>
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