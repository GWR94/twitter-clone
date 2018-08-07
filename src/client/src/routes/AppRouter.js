import React from "react";
import {Router, Route, Switch} from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import DashboardPage from "../components/DashboardPage";
import NotFoundPage from "../components/NotFoundPage";
// import Private from "./PrivateRoute";
import Public from "./PublicRoute";
import Landing from "../components/Landing";
import SignUp from "../components/SignUp";
import Login from "../components/Login";
import * as actions from "../actions";

export const history = createHistory();

class AppRouter extends React.Component {
    componentWillMount() {
        const {fetchUser} = this.props;
        fetchUser();
    }

    render() {
        const {auth} = this.props;
        const isAuthenticated = !!auth;

        return (
            <Router history={history}>
                <Switch>
                    <Public path="/login" component={Login}/>
                    <Public path="/i/flow/signup" component={SignUp}/>
                    <Route
                        path="/"
                        component={isAuthenticated
                        ? DashboardPage
                        : Landing}
                        exact
                    />
                    <Route component={NotFoundPage}/>
                </Switch>
            </Router>
        )
    }
};

AppRouter.propTypes = {
    fetchUser: PropTypes.func.isRequired,
    auth: PropTypes.oneOfType([
        PropTypes.shape({
            isVerified: PropTypes.bool,
            _id: PropTypes.string,
            email: PropTypes.string,
            headerImg: PropTypes.any,
            profileImg: PropTypes.string,
            username: PropTypes.string
        }),
        PropTypes.string])
}

AppRouter.defaultProps = {
    auth: false
}


const mapStateToProps = ({auth}) => ({auth});

export default connect(mapStateToProps, actions)(AppRouter);
