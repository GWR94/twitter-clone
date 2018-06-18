import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import Header from '../components/NavBar';

export const PrivateRoute = ({ isAuthenticated, component: Component, ...rest}) => (
    <Route {...rest} component={(props) => (
        isAuthenticated ? (
            <div>
                <Header />
                <Component {...props} />
            </div>
        ) : (
            <Redirect to="/"/>
        ) 
    )}/>
);

const mapStateToProps = ({auth}) => (
    console.log(auth), {
    //!! changes from true & undefined to true and false values
    isAuthenticated: !!auth
});

export default connect(mapStateToProps)(PrivateRoute);