import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

export const PublicRoute = ({ isAuthenticated, component: Component, ...rest}) => (
    <Route {...rest} component={(props) => (
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
    //!! changes from true & undefined to true and false values
    isAuthenticated: !!auth
});

export default connect(mapStateToProps)(PublicRoute);