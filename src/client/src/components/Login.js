import React from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";

/*
    TODO
    [ ] Sort out remember me
    [ ] Create and link Activate component
*/

const Login = () => (
    <div className="login--container">
        <div className="navbar--background">
            <div className="navbar__container">
                <div className="navbar--Logincontainer">
                    <div className="navbar--nav__container">
                        <div className="navbar--nav">
                            <Link to="/" exact className="navbar--linkLogin text-center">
                                <i className="icon__twitterLogin fab fa-twitter"/>
                                <p className="navbar--linkText">Home</p>
                            </Link>
                            <a
                                href="https://about.twitter.com/"
                                className="navbar--linkLogin text-center"
                                style={{
                                width: "60px"
                            }}>
                                <p className="navbar--linkText">About</p>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="login--boxContainer">
            <div className="login--innerContainer">
                <h2 className="login--title">Log in to Twitter</h2>
                <form action="/auth/login" method="post">
                    <input
                        type="text"
                        placeholder="Email or username"
                        name="username"
                        className="login--textInput"
                    />
                    <input type="password" placeholder="Password" name="password" className="login--textInput"/>
                    <div className="login--buttonContainer">
                        <button
                            className="button__loginLarge"
                            type="submit"
                            style={{
                            float: "left"
                        }}>
                            Log in
                        </button>
                        <label htmlFor="rememberMe" className="login--checkboxLabel">
                            <input
                                type="checkbox"
                                className="login--checkbox"
                                name="Remember me"
                                id="rememberMe"/>
                            Remember me
                        </label>
                        <p
                            className="trends--textSeperator"
                            style={{
                            display: "inline-block"
                        }}>
                            ·
                        </p>
                        <Link to="/account/begin_password_reset" className="login--forgotText">
                            Forgot password?
                        </Link>
                    </div>
                </form>
            </div>
            <div className="login--bottomContainer">
                <div className="login--bottomInnerContainer">
                    <div>
                        <p className="login--signUpText">New to Twitter?
                        </p>
                        <Link to="/i/flow/signup" className="login--signUpLink">Sign up now »</Link>
                    </div>
                    <div>
                        <p className="login--signUpText">Already using Twitter via text message?
                        </p>
                        <Link to="/account/complete" className="login--signUpLink">Active your account »</Link>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const mapStateToProps = ({auth}) => ({auth});

export default connect(mapStateToProps)(Login);