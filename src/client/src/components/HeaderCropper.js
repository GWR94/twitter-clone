import React, { Component } from "react";
import { Croppie } from "croppie";
import { PropTypes } from "prop-types";
import { connect } from "react-redux";
import * as actions from "../actions";

class HeaderCropper extends Component {
    constructor(props) {
        super(props);
        this.headerRef = React.createRef;
    }

    componentDidMount() {
        const { img } = this.props;
        this.c = new Croppie(this.headerRef.current, {
            mouseWheelZoom: false,
        });

        this.c.bind({
            url: img,
        });
    }

    render() {
        return (
            <div>
                <img alt="Profile Image" className="cropper--img" ref={this.headerRef} />
            </div>
        );
    }
}

HeaderCropper.propTypes = {
    img: PropTypes.string.isRequired,
    closeModal: PropTypes.func.isRequired,
    auth: PropTypes.shape({}).isRequired,
    uploadPhoto: PropTypes.func.isRequired,
    setProfileImage: PropTypes.func.isRequired,
};

const mapStateToProps = ({ auth }) => ({ auth });

export default connect(
    mapStateToProps,
    actions,
)(HeaderCropper);
