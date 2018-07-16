import React from 'react';
import {Router, Route, Switch, Link, NavLink} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Landing from '../components/Landing';
import SignUp from '../components/SignUp';

import * as actions from '../actions';
import {connect} from 'react-redux';

export const history = createHistory();

class AppRouter extends React.Component {
  componentWillMount() {
    this
      .props
      .fetchUser();
  }
  render() {
    return (
      <Router history={history}>
        <Switch>
          <PublicRoute path="/login" component={Landing} />
          <PublicRoute path="/i/flow/signup" component={SignUp}/>
          <PrivateRoute path="/" component={DashboardPage} exact/>
          <Route component={NotFoundPage}/>
        </Switch>
      </Router>
    )
  }
};

export default connect(null, actions)(AppRouter);
