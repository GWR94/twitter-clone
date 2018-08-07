import React from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import * as actions from "../actions";

const Landing = () => (
    <div className="container-fluid landing--container">
        <div className="row">
            <div className="col-md-6 landing--infoContainer">
                <div className="landing--bgContainer">
                    <img
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4IgogICAgIHdpZHRoPSI0ODAiIGhlaWdodD0iNDgwIgogICAgIHZpZXdCb3g9IjAgMCA1MCA1MCIKICAgICBzdHlsZT0iZmlsbDojMUI5NUUwOyI+PGcgaWQ9InN1cmZhY2UxIj48cGF0aCBzdHlsZT0iICIgZD0iTSA1MC4wNjI1IDEwLjQzNzUgQyA0OC4yMTQ4NDQgMTEuMjU3ODEzIDQ2LjIzNDM3NSAxMS44MDg1OTQgNDQuMTUyMzQ0IDEyLjA1ODU5NCBDIDQ2LjI3NzM0NCAxMC43ODUxNTYgNDcuOTEwMTU2IDguNzY5NTMxIDQ4LjY3NTc4MSA2LjM3MTA5NCBDIDQ2LjY5MTQwNiA3LjU0Njg3NSA0NC40ODQzNzUgOC40MDIzNDQgNDIuMTQ0NTMxIDguODYzMjgxIEMgNDAuMjY5NTMxIDYuODYzMjgxIDM3LjU5NzY1NiA1LjYxNzE4OCAzNC42NDA2MjUgNS42MTcxODggQyAyOC45NjA5MzggNS42MTcxODggMjQuMzU1NDY5IDEwLjIxODc1IDI0LjM1NTQ2OSAxNS44OTg0MzggQyAyNC4zNTU0NjkgMTYuNzAzMTI1IDI0LjQ0OTIxOSAxNy40ODgyODEgMjQuNjI1IDE4LjI0MjE4OCBDIDE2LjA3ODEyNSAxNy44MTI1IDguNTAzOTA2IDEzLjcxODc1IDMuNDI5Njg4IDcuNDk2MDk0IEMgMi41NDI5NjkgOS4wMTk1MzEgMi4wMzkwNjMgMTAuNzg1MTU2IDIuMDM5MDYzIDEyLjY2Nzk2OSBDIDIuMDM5MDYzIDE2LjIzNDM3NSAzLjg1MTU2MyAxOS4zODI4MTMgNi42MTMyODEgMjEuMjMwNDY5IEMgNC45MjU3ODEgMjEuMTc1NzgxIDMuMzM5ODQ0IDIwLjcxMDkzOCAxLjk1MzEyNSAxOS45NDE0MDYgQyAxLjk1MzEyNSAxOS45ODQzNzUgMS45NTMxMjUgMjAuMDI3MzQ0IDEuOTUzMTI1IDIwLjA3MDMxMyBDIDEuOTUzMTI1IDI1LjA1NDY4OCA1LjUgMjkuMjA3MDMxIDEwLjE5OTIxOSAzMC4xNTYyNSBDIDkuMzM5ODQ0IDMwLjM5MDYyNSA4LjQyOTY4OCAzMC41MTU2MjUgNy40OTIxODggMzAuNTE1NjI1IEMgNi44MjgxMjUgMzAuNTE1NjI1IDYuMTgzNTk0IDMwLjQ1MzEyNSA1LjU1NDY4OCAzMC4zMjgxMjUgQyA2Ljg2NzE4OCAzNC40MTAxNTYgMTAuNjY0MDYzIDM3LjM5MDYyNSAxNS4xNjAxNTYgMzcuNDcyNjU2IEMgMTEuNjQ0NTMxIDQwLjIzMDQ2OSA3LjIxMDkzOCA0MS44NzEwOTQgMi4zOTA2MjUgNDEuODcxMDk0IEMgMS41NTg1OTQgNDEuODcxMDk0IDAuNzQyMTg4IDQxLjgyNDIxOSAtMC4wNTg1OTM4IDQxLjcyNjU2MyBDIDQuNDg4MjgxIDQ0LjY0ODQzOCA5Ljg5NDUzMSA0Ni4zNDc2NTYgMTUuNzAzMTI1IDQ2LjM0NzY1NiBDIDM0LjYxNzE4OCA0Ni4zNDc2NTYgNDQuOTYwOTM4IDMwLjY3OTY4OCA0NC45NjA5MzggMTcuMDkzNzUgQyA0NC45NjA5MzggMTYuNjQ4NDM4IDQ0Ljk0OTIxOSAxNi4xOTkyMTkgNDQuOTMzNTk0IDE1Ljc2MTcxOSBDIDQ2Ljk0MTQwNiAxNC4zMTI1IDQ4LjY4MzU5NCAxMi41IDUwLjA2MjUgMTAuNDM3NSBaICI+PC9wYXRoPjwvZz48L3N2Zz4="
                        className="landing--backgroundImg"
                        alt="Header"/>
                </div>
                <div className="landing--tagLinesContainer">
                    <i className="landing--tagIcon fas fa-search"/>
                    <p className="landing--tagInfo">Follow your interests.</p>
                    <i className="landing--tagIcon fas fa-users"/>
                    <p className="landing--tagInfo">Hear what people are talking about.</p>
                    <i className="landing--tagIcon far fa-comment"/>
                    <p className="landing--tagInfo">Join the conversation.</p>
                </div>
            </div>
            <div className="col-md-6 landing--signUpContainer">
                <div className="d-none d-lg-flex landing--signUpInnerContainer">
                    <form action="/auth/login" method="post">
                        <input
                            type="text"
                            name="handle"
                            className="landing--loginInput"
                            placeholder="Phone, email or username"/>
                        <input
                            type="password"
                            className="landing--loginInput"
                            placeholder="Password"
                            name="password"/>
                        <button
                            className="btn button__twitter"
                            type="submit"
                            style={{
                            float: "right",
                            position: "relative",
                            bottom: "0"
                        }}>
                            Log in
                        </button>
                        <Link to="/account" className="landing--lostPasswordLink">Forgot password?</Link>
                    </form>
                </div>
                <div className="landing--joinContainer">
                    <div className="landing--loginHiddenButtonContainer">
                        <i className="landing--twitterIcon fab fa-twitter"/>
                        <Link
                            className="button__twitterLarge d-flex d-lg-none"
                            to="/login"
                            style={{
                                float: "right"
                            }}
                        >
                            Log in
                        </Link>
                    </div>

                    <h2 className="landing--tagLineText">See what’s happening in the world right now</h2>
                    <h5 
                        className="landing--subTagLineText"
                        style={{
                        marginTop: "30px"
                    }}>
                        Join Twitter today.
                    </h5>
                    <Link
                        to="/i/flow/signup"
                        className="btn button__signup"
                        style={{
                        width: "100%",
                        margin: "16px 0"
                    }}>
                        Sign Up
                    </Link>
                    <Link
                        to="/login"
                        className="btn button__twitter"
                        style={{
                        width: "100%"
                    }}>
                        Log in
                    </Link>
                </div>
            </div>
        </div>
    </div>
);

const mapStateToProps = ({auth}) => ({auth});

export default connect(mapStateToProps, actions)(Landing);
