import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ProfileOverview from "./ProfileOverview";
import WhoToFollow from "./WhoToFollow";
import Trends from "./Trends";
import Feed from "./Feed";
import NavBar from "./NavBar";
/*
    TODO
    [ ] Add red bar at top of page to send confirmation email
    [ ] Add progress bar for setting up profile below ProfileOverview component
    [ ] Fix Login Component styling (NavBar)
*/

const DashboardPage = () => (
    <div>
        <NavBar />
        <div className="dashboard--background" id="dashboard">
            <div className="dashboard--container">
                <div className="dashboard--grid-container">
                    <div className="dashboard--profile">
                        <ProfileOverview />
                    </div>
                    <div className="dashboard--feed">
                        <Feed showFeed />
                    </div>
                    <div className="dashboard--whoToFollow">
                        <WhoToFollow />
                    </div>
                    <div className="dashboard--trends">
                        <Trends />
                    </div>
                    <Link to="/profile/james_gower">Profile</Link>
                </div>
            </div>
        </div>
    </div>
);

const mapStateToProps = ({ auth, twitter }) => ({ auth, twitter });

export default connect(mapStateToProps)(DashboardPage);
