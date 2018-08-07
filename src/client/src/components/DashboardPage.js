import React from "react";
import {connect} from "react-redux";
import Profile from "./Profile";
import WhoToFollow from "./WhoToFollow";
import Trends from "./Trends";
import Feed from "./Feed";
import NavBar from "./NavBar";

// ! Sort out search bars' outline

/*
    TODO
    [ ] Fix Heroku login process.
    !! NO EMAIL WHEN SIGNUP ON HEROKU - CHECK LOCAL & FIX.
*/
const DashboardPage = () => (
    <div>
        <NavBar/>
        <div className='dashboard--background'>
            <div className='dashboard--container'>
                <div className='dashboard--grid-container'>
                    <div className='dashboard--profile'>
                        <Profile/>
                    </div>
                    <div className='dashboard--feed'>
                        <Feed/>
                    </div>
                    <div className='dashboard--ads'/>
                    <div className='dashboard--whoToFollow'>
                        <WhoToFollow/>
                    </div>
                    <div className='dashboard--trends'>
                        <Trends/>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const mapStateToProps = ({auth, twitter}) => ({auth, twitter});

export default connect(mapStateToProps)(DashboardPage);
