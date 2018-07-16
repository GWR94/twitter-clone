import React from 'react';
import {connect} from 'react-redux';
import Profile from './Profile';
import WhoToFollow from './WhoToFollow';
import Trends from './Trends';
import Feed from './Feed';

class DashboardPage extends React.Component {
  constructor() {
    super();

    this.state = {
      
    }
  }

  render() {
    return (
      <div className="dashboard--background">
        <div className="dashboard--container">
          <div className='dashboard--grid-container'>
            <div className="dashboard--profile">
              <Profile/>
            </div>
            <div className="dashboard--feed">
              <Feed />
            </div>
            <div className="dashboard--ads"></div>
            <div className="dashboard--whoToFollow">
              <WhoToFollow />
            </div>
            <div className="dashboard--trends">
              <Trends />
            </div>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
  return {auth}
}

export default connect(mapStateToProps)(DashboardPage);
