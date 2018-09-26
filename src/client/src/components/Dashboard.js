import React from "react";
import { connect } from "react-redux";
import { PropTypes } from "prop-types";
import ProfileOverview from "./ProfileOverview";
import WhoToFollow from "./WhoToFollow";
import Trends from "./Trends";
import Feed from "./Feed";
import NavBar from "./NavBar";

/*
    TODO
    [ ] Add red bar at top of page to send confirmation email
    [x] Add progress bar for setting up profile below ProfileOverview component
    [ ] Fix Login Component styling (NavBar)
*/

const DashboardPage = props => {
    const { auth } = props;
    return (
        <div>
            <NavBar />
            <div className="dashboard--background" id="dashboard">
                <div className="dashboard--container">
                    <div className="dashboard--grid-container">
                        <div className="dashboard--profile">
                            <ProfileOverview />
                        </div>
                        <div className="dashboard--feed">
                            <Feed userInfo handle={auth.handle} showFeed />
                        </div>
                        <div className="dashboard--whoToFollow">
                            <WhoToFollow />
                        </div>
                        <div className="dashboard--trends">
                            <Trends />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

DashboardPage.propTypes = {
    auth: PropTypes.shape().isRequired,
};

const mapStateToProps = ({ auth, twitter }) => ({ auth, twitter });

export default connect(mapStateToProps)(DashboardPage);
