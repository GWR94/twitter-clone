import React from 'react';
import * as actions from '../actions';
import {connect} from 'react-redux';

class Trends extends React.Component {
    constructor() {
        super();

        this.state = {};
    }
    render() {
        return (
            <div>
                <h4 className="header-text">Trends for you</h4>
            </div>
        )
    }
}

const mapStateToProps = ({auth}) => {
    return {auth};
};

export default connect(mapStateToProps, actions)(Trends);