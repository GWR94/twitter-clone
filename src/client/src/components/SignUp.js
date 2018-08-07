import React from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import validator from "validator";
import {Link} from "react-router-dom";
import {Tooltip} from "reactstrap";
import {connect} from "react-redux";
import * as actions from "../actions";


/* 
    TODO
    [ ] Generate random @ for new users
    [ ] Setup automatic login
*/

export const desktopStyles = {
    overlay: {
        backgroundColor: "rgba(17, 17, 17, 0.8)"
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "600px",
        height: "70%"
    }
};

export const mobileStyles = {
    content: {
        top: "0",
        left: "0",
        right: "0",
        bottom: "0"
    }
};

class SignUp extends React.Component {
    constructor() {
        super();

        this.state = {
            name: "",
            email: "",
            modalIsOpen: true,
            nameError: false,
            emailError: false,
            mobile: window.innerWidth <= 600,
            currentPage: 1,
            activityChecked: false,
            connectChecked: false,
            adsChecked: false,
            passwordStrength: 0,
            password: ""
        };

        this.openModal = this
            .openModal
            .bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        const mobile = window.innerWidth <= 600;
        this.setState({mobile});
    };

    openModal() {
        this.setState({modalIsOpen: true});
    }

    render() {
        const {
            modalIsOpen,
            mobile,
            currentPage,
            email,
            name,
            nameError,
            emailError,
            password,
            connectChecked,
            activityChecked,
            adsChecked,
            passwordStrength
        } = this.state;

        const {createUser, history} = this.props;

        return (
            <div>
                <Modal
                    isOpen={modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={mobile
                    ? mobileStyles
                    : desktopStyles}
                    contentLabel="Sign Up">
                    {currentPage === 1 && (
                        <div>
                            <div className="icon__container">
                                <i className="icon__twitter fab fa-twitter"/>
                                <button
                                    disabled={email
                                    .trim()
                                    .length === 0 || name
                                    .trim()
                                    .length === 0 || emailError || nameError}
                                    className="btn button__modal button__signup"
                                    type="button"
                                    onClick={() => this.setState({currentPage: 2})}>
                                    Next
                                </button>
                            </div>
                            <div className="modal__content">
                                <h4
                                    className="modal__title"
                                    style={{
                                    marginTop: "30px"
                                }}>
                                    Create your account
                                </h4>
                                <input
                                    type="text"
                                    className={nameError
                                    ? "input__error modal__input"
                                    : "modal__input"}
                                    placeholder="Name"
                                    onBlur={(e) => {
                                    if (e.target.value.trim().length === 0) {
                                        this.setState({nameError: true});
                                    } else {
                                        this.setState({name: e.target.value, nameError: false});
                                    }
                                }}/> {nameError && (
                                    <p className="modal__error" id="name__error">
                                        {"What's your name?"}
                                    </p>
                                )}
                                <input
                                    type="email"
                                    className={emailError
                                    ? "input__error modal__input"
                                    : "modal__input"}
                                    placeholder="Email"
                                    onBlur={(e) => {
                                    if (e.target.value.trim().length === 0) {
                                        this.setState({emailError: true});
                                    } else if (validator.isEmail(e.target.value)) {
                                        this.setState({email: e.target.value, emailError: false});
                                    } else {
                                        this.setState({emailError: true});
                                    }
                                }}/> {emailError && (
                                    <p className="modal__error" id="email__error">
                                        Please enter a valid email address.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                    {currentPage === 2 && (
                        <div>
                            <div className="icon__container">
                                <i
                                    className="icon__back fas fa-arrow-left"
                                    onClick={() => this.setState({
                                    currentPage: currentPage - 1
                                })}/>
                                <i className="icon__twitter fab fa-twitter"/>
                                <button
                                    type="button"
                                    className="btn button__modal button__signup"
                                    onClick={() => this.setState({
                                    currentPage: currentPage + 1
                                })}>
                                    Next
                                </button>
                            </div>
                            <div className="modal__content">
                                <h4
                                    className="modal__title"
                                    style={{
                                    marginBottom: "40px"
                                }}>
                                    Customise your experience
                                </h4>
                                <div className="row row__inputs">
                                    <div className="col-11">
                                        <h5 className="modal__subtitle">Connect with people you know</h5>
                                        <p>Let others find your Twitter account by your email address</p>
                                    </div>
                                    <div
                                        className="col-1 checkbox__container"
                                        onClick={() => this.setState({
                                        connectChecked: !connectChecked
                                    })}>
                                        <input type="checkbox" checked={connectChecked}/>
                                        <span>✓</span>
                                    </div>
                                </div>
                                <div className="row row__inputs">
                                    <div className="col-11">
                                        <h5 className="modal__subtitle">Get more out of Twitter</h5>
                                        <p className="input__label">
                                            Receive email about your Twitter activity and recommendations
                                        </p>
                                    </div>
                                    <div
                                        className="col-1 checkbox__container"
                                        onClick={() => this.setState({
                                        activityChecked: !activityChecked
                                    })}>
                                        <input type="checkbox" checked={activityChecked}/>
                                        <span>✓</span>
                                    </div>
                                </div>
                                <div className="row row__inputs">
                                    <div className="col-11">
                                        <h5 className="modal__subtitle">See better ads</h5>
                                        <p className="input__label">
                                            Receive personalised ads based on your activity off Twitter
                                        </p>
                                    </div>
                                    <div
                                        className="col-1 checkbox__container"
                                        onClick={() => this.setState({
                                        adsChecked: !adsChecked
                                    })}>
                                        <input type="checkbox" checked={adsChecked}/>
                                        <span>✓</span>
                                    </div>
                                </div>
                                <p className="information__text">
                                    For more details about these settings, visit the{" "}
                                    <Link className="link" to="/help-center">
                                        Help Center
                                    </Link>
                                </p>
                            </div>
                        </div>
                    )}
                    {currentPage === 3 && (
                        <div>
                            <div className="icon__container">
                                <i
                                    className="icon__back fas fa-arrow-left"
                                    onClick={() => this.setState({
                                    currentPage: currentPage - 1
                                })}/>
                                <i className="icon__twitter fab fa-twitter"/>
                            </div>
                            <div
                                className="modal__content"
                                style={{
                                marginBottom: "10px"
                            }}>
                                <h4 className="modal__title">Create your account</h4>
                                <input
                                    type="text"
                                    className="modal__input"
                                    style={{
                                    marginBottom: "0"
                                }}
                                    value={name}
                                    onClick={() => this.setState({currentPage: 1})}/>
                                <input
                                    type="text"
                                    className="modal__input"
                                    value={email}
                                    onClick={() => this.setState({currentPage: 1})}/>
                                <p className="terms__text">
                                    By signing up, you agree to our{" "}
                                    <Link to="/terms" className="link">
                                        Terms
                                    </Link>,{" "}
                                    <Link to="/privacy" className="link">
                                        Privacy Policy
                                    </Link>, and{" "}
                                    <Link to="/cookies" className="link">
                                        Cookie Use
                                    </Link>. You also agree that you’re over 13 years of age.
                                </p>
                                <button
                                    className="btn button__signup"
                                    style={{
                                    width: "100%",
                                    fontSize: "20px"
                                }}
                                    type="button"
                                    onClick={() => this.setState({currentPage: 4})}>
                                    Sign Up
                                </button>
                            </div>
                        </div>
                    )}
                    {currentPage === 4 && (
                        <div>
                            <div className="icon__container">
                                <i className="icon__twitter fab fa-twitter"/>
                                <button
                                    disabled={passwordStrength <= 1}
                                    className="btn button__modal button__signup"
                                    type="button"
                                    onClick={() => createUser({
                                        handle: name,
                                        password,
                                        email
                                    }, history)}
                                    >
                                    Next
                                </button>
                            </div>
                            <div className="modal__content">
                                <h4 className="modal__title">You&#39;ll need a password</h4>
                                <p>Make sure it&#39;s 6 characters or more</p>
                                <input
                                    type="password"
                                    className="modal__password"
                                    value={password}
                                    id="password"
                                    placeholder="Password"
                                    onChange={(e) => {
                                    
                                        const strongPW = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
                                        const pass = e.target.value.trim();

                                        if (strongPW.test(pass)) {
                                            this.setState({password: pass, passwordStrength: 3});
                                            document
                                                .getElementById("password")
                                                .classList
                                                .add("strong__password");
                                            document
                                                .getElementById("password")
                                                .classList
                                                .remove("medium__password");
                                            document
                                                .getElementById("password")
                                                .classList
                                                .remove("invalid__password");
                                        } else if (!strongPW.test(pass) && pass.length >= 8) {
                                            this.setState({password: pass, passwordStrength: 2});
                                            document
                                                .getElementById("password")
                                                .classList
                                                .add("medium__password");
                                            document
                                                .getElementById("password")
                                                .classList
                                                .remove("strong__password");
                                            document
                                                .getElementById("password")
                                                .classList
                                                .remove("invalid__password");
                                        } else {
                                            this.setState({password: null, passwordStrength: 1});
                                            document
                                                .getElementById("password")
                                                .classList
                                                .add("invalid__password");
                                            document
                                                .getElementById("password")
                                                .classList
                                                .remove("medium__password");
                                            document
                                                .getElementById("password")
                                                .classList
                                                .remove("strong__password");
                                        }
                                    }}/>
                                <Tooltip
                                    placement="bottom"
                                    isOpen={passwordStrength > 0 && passwordStrength !== 3}
                                    target="password">
                                    {(passwordStrength === 1 && (
                                        <p
                                            style={{
                                            paddingTop: "10px"
                                        }}>
                                            Invalid password.<br/>Password must be at least 8 characters
                                        </p>
                                    )) || (passwordStrength === 2 && (
                                        <p
                                            style={{
                                            paddingTop: "10px"
                                        }}>
                                            OK password. Try adding a mix of numeric, lower, upper & special characters.
                                        </p>
                                    ))}
                                </Tooltip>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        );
    }
}
SignUp.propTypes = {
    createUser: PropTypes.func.isRequired,
    history: PropTypes
        .shape({
            length: PropTypes.number,
            action: PropTypes.string
        })
        .isRequired
};
const mapStateToProps = ({auth}) => ({auth});

export default connect(mapStateToProps, actions)(SignUp);