import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import PropTypes from "prop-types";

export const PublicRoute = ({ isAuthenticated, component: Component, ...rest}) => (
    <Route 
        {...rest} 
        component={(props) => (
        isAuthenticated ? (
            <Redirect to="/"/>
        ) : (
            <div>
                <Component {...props} />
            </div>
        ) 
    )}/>
);

const mapStateToProps = ({auth}) => (
    {
    isAuthenticated: !!auth
    // : !!auth changes from true & undefined to true and false values
});

PublicRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    component: PropTypes.node.isRequired
}

export default connect(mapStateToProps)(PublicRoute);