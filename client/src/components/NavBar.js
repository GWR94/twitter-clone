import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';
import 'bootstrap/dist/js/bootstrap.bundle.min'

class NavBar extends Component {
    constructor() {
        super();

        this.state = {
            dropdownOpen: false
        };
    };

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        return (
            <div className="navbar__container">
                <div className="navbar--container">
                    <div className="navbar--nav__container">
                        <div className="navbar--nav">
                            <i className="icon--twitter fab fa-twitter"></i>
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
                    </div>
                    <div className="navbar--details__container">
                        <div className="navbar--details">
                            <div className="navbar--search__container">
                                <input
                                    type="text"
                                    placeholder="Search Twitter"
                                    onChange={e => this.setState({searchInput: e.target.value})}
                                    className="navbar--search"/>
                            </div>
                            <i className="fas fa-search navbar--searchBtn"></i>
                            <div>
                                <div className="dropdown show">
                                    <a
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        <img src={this.props.auth.profileImg} className="navbar--img"/>
                                    </a>
                                    <button className="btn button__signup">Tweet</button>

                                    <div
                                        className="dropdown-menu-left dropdown-menu"
                                        aria-labelledby="dropdownMenuLink">
                                        <div className="dropdown--profile">
                                            <p className="dropdown--profile-name">Name</p>
                                            <p className="dropdown--profile-handle">@{this.props.auth.username}</p>
                                        </div>
                                        <div
                                            className="dropdown-divider"
                                            style={{
                                            marginTop: '-8px'
                                        }}></div>
                                        <a className="dropdown-item">
                                            <i className="far fa-user icon-dropdown"></i>Profile</a>
                                        <a className="dropdown-item">
                                            <i className="far fa-list-alt icon-dropdown"></i>Lists</a>
                                        <a className="dropdown-item">
                                            <i className="fas fa-bolt icon-dropdown"></i>Moments</a>
                                        <div className="dropdown-divider"/>
                                        <a className="dropdown-item">
                                            <i className="fas fa-dollar-sign icon-dropdown"></i>Promote Mode</a>
                                        <a className="dropdown-item">
                                            <i className="fas fa-shopping-cart icon-dropdown"></i>Twitter Ads</a>
                                        <a className="dropdown-item">
                                            <i className="fas fa-chart-bar icon-dropdown"></i>Analytics</a>
                                        <div className="dropdown-divider"/>
                                        <a className="dropdown-item">Settings and privacy</a>
                                        <a className="dropdown-item">Help Center</a>
                                        <a className="dropdown-item">Keyboard Shortcuts</a>
                                        <a className="dropdown-item" href="/api/logout">Log out</a>
                                        <div className="dropdown-divider"/>
                                        <a className="dropdown-item">Night Mode<i className="far fa-moon icon-darkmode"></i>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return {auth}
}

export default connect(mapStateToProps)(NavBar);