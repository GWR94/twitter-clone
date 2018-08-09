import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../actions";
import PropTypes from "prop-types";
import NavBar from "./NavBar";
import defaultDisplayImg from "../../../../public/images/displayPicturePlaceholder.png";

class Profile extends Component {
    constructor() {
        super();

        this.state = {};
    }

    componentDidMount() {
        const { auth, handle, fetchTweets } = this.props;
        fetchTweets(handle);
    }

    render() {
        const { auth } = this.props;
        const { displayImgSrc } = auth;
        return (
            <div>
                <NavBar />
                <img src={displayImgSrc || defaultDisplayImg} />
            </div>
        );
    }
}

Profile.propTypes = {};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(Profile);
