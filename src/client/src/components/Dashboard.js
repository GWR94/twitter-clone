import React from "react";
import { connect } from "react-redux";
import ProfileOverview from "./ProfileOverview";
import WhoToFollow from "./WhoToFollow";
import Trends from "./Trends";
import Feed from "./Feed";
import NavBar from "./NavBar";

const DashboardPage = () => (
    <div>
        <NavBar />
        <div className="dashboard--background">
            <div className="dashboard--container">
                <div className="dashboard--grid-container">
                    <div className="dashboard--profile">
                        <ProfileOverview />
                    </div>
                    <div className="dashboard--feed">
                        <Feed />
                    </div>
                    <div className="dashboard--ads" />
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

const mapStateToProps = ({ auth, twitter }) => ({ auth, twitter });

export default connect(mapStateToProps)(DashboardPage);
