import React, { Component } from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import * as actions from "../actions";
import loader from "../../../../public/images/loader.gif";

class UserProfile extends Component {
    state = {};

    async componentWillMount() {
        const { name, getUser } = this.props;
        await getUser(name);
    }

    render() {
        const { user } = this.props;
        if (user) {
            return <div>{user.displayName}</div>;
        }
        return <img src={loader} alt="loading..." />;
    }
}

UserProfile.propTypes = {
    name: PropTypes.string.isRequired,
    getUser: PropTypes.func.isRequired,
};

const mapStateToProps = ({ user }) => ({ user });

export default connect(
    mapStateToProps,
    actions,
)(UserProfile);
