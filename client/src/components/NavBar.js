import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
class NavBar extends Component {
    constructor() {
        super();

        this.state = {};
    };

    render() {
        return (
            <div className="navbar">
                <NavLink to="/dashboard" className="navbar--link" activeClassName="active">
                    <i className="fas fa-home icon--nav"></i>
                    <span className="navbar--text">Home</span>
                </NavLink>
                <NavLink to="/moments" className="navbar--link" activeClassName="active">
                    <i className="fas fa-bolt icon--nav"></i>
                    <span className="navbar--text">Moments</span>
                </NavLink>
                <NavLink to="/notifications" className="navbar--link" activeClassName="active">
                    <i className="fas fa-bell icon--nav"></i>
                    <span className="navbar--text">Notifications</span>
                </NavLink>
                <NavLink to="/messages" className="navbar--link" activeClassName="active">
                    <i className="fas fa-envelope icon--nav"></i>
                    <span className="navbar--text">Messages</span>
                </NavLink>
            </div>
        )
    }
}

export default NavBar;