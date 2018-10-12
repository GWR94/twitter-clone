import React, { Component } from "react";
import { Croppie } from "croppie";

class Cropper extends Component {
    constructor(props) {
        super(props);
        this.cropperRef = React.createRef();
    }

    componentDidMount() {
        const { img } = this.props;
        const c = new Croppie(this.cropperRef.current, {
            viewport: {
                width: 220,
                height: 220,
                type: "circle",
            },
            boundary: {
                width: 295,
                height: 240,
            },
            mouseWheelZoom: false,
        });

        c.bind({
            url: img,
        });
    }

    render() {
        const { closeModal } = this.props;
        return (
            <div className="cropper--container">
                <div className="cropper--errorCloseIcon">
                    <i className="fas fa-times" onClick={() => closeModal()} />
                </div>
                <h4 className="cropper--header">Position and size your photo</h4>
                <div className="cropper--imgContainer">
                    <img alt="Profile Image" className="cropper--img" ref={this.cropperRef} />
                </div>
                <div className="cropper--buttonContainer">
                    <button
                        type="button"
                        className="button__themeColor"
                        onClick={() => closeModal()}
                    >
                        Cancel
                    </button>
                    <button type="button" className="button__confirm">
                        Apply
                    </button>
                </div>
            </div>
        );
    }
}

export default Cropper;
