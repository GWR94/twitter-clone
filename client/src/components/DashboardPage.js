import React from 'react';
import {connect} from 'react-redux';
import Header from './NavBar';

class DashboardPage extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div>
        Dashboard Page Content!
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
  return {auth}
}

export default connect(mapStateToProps)(DashboardPage);
