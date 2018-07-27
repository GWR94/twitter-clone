import React from "react";
import {connect} from "react-redux";
import {Route, Redirect} from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../components/NavBar";

export const PrivateRoute = ({
    isAuthenticated,
    component: Component,
    ...rest
}) => (
    <Route
        {...rest}
        component={(props) => (isAuthenticated
        ? (
            <div>
                <Header/>
                <Component {...props}/>
            </div>
        )
        : (<Redirect to="/login"/>))}/>
);

const mapStateToProps = ({auth}) => ({
    isAuthenticated: !!auth
});

PrivateRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.node.isRequired
}

export default connect(mapStateToProps)(PrivateRoute);