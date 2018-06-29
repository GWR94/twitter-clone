import React from 'react';
import {connect} from 'react-redux';
import Profile from './Profile';
import WhoToFollow from './WhoToFollow';
class DashboardPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="dashboard--background">
        <div className="dashboard--container">
          <div className='dashboard--grid-container'>
            <div className="dashboard--profile">
              <Profile/>
            </div>
            <div className="dashboard--feed"></div>
            <div className="dashboard--ads"></div>
            <div className="dashboard--whoToFollow">
              <WhoToFollow />
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
