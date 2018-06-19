import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {connect} from 'react-redux';

class NavBar extends Component {
    constructor() {
        super();

        this.state = {
            desktop: window.innerWidth > 936
        };
    };
    componentDidMount() {
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions)
    }

    updateWindowDimensions = () => {
        let desktop = window.innerWidth > 936;
        this.setState({desktop});
    }

    render() {
        return (
            <div className="navbar__container">
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
                            <i className="fas fa-search navbar--searchBtn"></i>
                        </div>
                        <img src={this.props.auth.photo} className="navbar--img"/>
                        <button className="btn button__signup">Tweet</button>
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