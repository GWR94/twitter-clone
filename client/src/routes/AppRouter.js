import React from 'react';
import {Router, Route, Switch, Link, NavLink} from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import DashboardPage from '../components/DashboardPage';
import NotFoundPage from '../components/NotFoundPage';
import LoginPage from '../components/LoginPage';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';
import Landing from '../components/Landing';
import SignUp from '../components/SignUp';

export const history = createHistory();

const AppRouter = () => (
  <Router history={history}>
    <Switch>
      <PublicRoute path="/" component={Landing} exact/>
      <PublicRoute path="/i/flow/signup" component={SignUp} />
      <PublicRoute path="/login" component={LoginPage} />
      <PrivateRoute path="/" component={DashboardPage} exact/>
      <Route component={NotFoundPage}/>
    </Switch>
  </Router>
);

export default AppRouter;
