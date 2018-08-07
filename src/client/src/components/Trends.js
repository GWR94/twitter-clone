import React from "react";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import Modal from "react-modal";
import * as actions from "../actions";
import twitterLocations from "../services/twitterLocations.json";
import countryList from "../services/twitterCountryLists";

class Trends extends React.Component {
    constructor() {
        super();

        this.state = {
            modalOpen: false,
            location: 44418,
            locationName: "London",
            currentCountry: "United Kingdom",
            searchQuery: "",
            recentLocations: [],
            nearbyLocations: [],
            searchLocation: false,
            searchCountry: null
        };
    }

    //! Add mobile styling

    async componentDidMount() {
        const {fetchTrends} = this.props;
        const {location, currentCountry} = this.state;
        const currentLocation = JSON.parse(localStorage.getItem("currentLocation"));
        if (currentLocation) {
            this.setState({location: currentLocation.locationID, locationName: currentLocation.locationName, currentCountry: currentLocation.country});
            const nearbyLocations = await this.handleNearbyLocations(currentCountry);
            this.setState({
                nearbyLocations: this.shuffle(nearbyLocations)
            });
        }
        await fetchTrends(location);
        const recentLocations = JSON.parse(localStorage.getItem("recentLocations"));
        if (recentLocations) 
            this.setState({recentLocations});
        }
    
    openModal = () => {
        this.setState({modalOpen: true});
    };

    closeModal = () => {
        this.setState({modalOpen: false});
    };

    searchLocation = (name) => {
        const results = twitterLocations.filter(location => location.name.toLowerCase().indexOf(name.toLowerCase()) > -1,);
        return results;
    }

    /* eslint-disable */
    shuffle(a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }
    /* eslint-enable */

    async handleLocation(location) {
        const {fetchTrends} = this.props;
        await fetchTrends(location);
        this.renderTrends();
    }

    async handleLocationClick(location) {
        this.setState({location: location.woeid, locationName: location.name, currentCountry: location.country, searchQuery: ""});
        this.handleLocation(location.woeid);
        const nearbyLocations = await this.handleNearbyLocations(location);
        await this.setState({
            nearbyLocations: this.shuffle(nearbyLocations)
        });
        this.renderNearbyLocations();
        let recent = localStorage.getItem("recentLocations");
        if (recent) {
            recent = JSON.parse(recent);
        } else {
            recent = [];
        }
        if (recent.indexOf(location.name) === -1) {
            recent.push(location.name);
        }
        localStorage.setItem("recentLocations", JSON.stringify(recent));
        const current = {
            locationName: location.name,
            locationID: location.woeid,
            country: location.country,
            allCities: location.placeType.name === "Country"
        };
        localStorage.setItem("currentLocation", JSON.stringify(current));
        this.setState({recentLocations: recent});
    }

    handleNearbyLocations(search) {
        const {searchCountry} = this.state;
        if (search && searchCountry) {
            return twitterLocations.filter(location => location.country.toLowerCase().indexOf(searchCountry.toLowerCase()) > -1);
        }
        const {currentCountry} = this.state;
        const nearbyLocations = twitterLocations.filter(location => location.country.toLowerCase().indexOf(currentCountry.toLowerCase()) > -1);
        return nearbyLocations;
    }

    renderNearbyLocations() {
        const {nearbyLocations, locationName} = this.state;
        return nearbyLocations
            .slice(0, 10)
            .map((usedLocation, i) => (
                <div className="col-4" key={`col${i}`}>
                    <div
                        className={usedLocation.name === locationName
                        ? ("trends--recentLocationActive")
                        : ("trends--recentLocation")}
                        key={i}
                        onClick={() => this.handleLocationClick(usedLocation)}>
                        {usedLocation.name}
                    </div>
                </div>
            ));
    };

    renderRecentLocations() {
        const {recentLocations, locationName} = this.state;
        return recentLocations
            .slice(-6)
            .map((location, i) => (
                <div className="col-4" key={`col${i}`}>
                    <div
                        className={location === locationName
                        ? ("trends--recentLocationActive")
                        : ("trends--recentLocation")}
                        key={i}
                        onClick={async() => {
                        const result = await this.searchLocation(location);
                        await this.handleLocation(result[0].woeid);
                        this.handleLocationClick(result[0]);
                    }}>
                        {location}
                    </div>
                </div>
            ))
    }

    renderSearchResults() {
        const {searchQuery} = this.state;
        let jsx;
        if (searchQuery.length > 0) {
            const results = this.searchLocation(searchQuery);
            if (results.length === 0) {
                return <div className="trends--searchResultItem">No results were found. Try selecting from a list</div>;
            }
            jsx = results
                .slice(0, 10)
                .map((result, i) => (
                    <div
                        className="trends--searchResultItem"
                        key={`div-${i}`}
                        onClick={async() => {
                        await this.setState({
                            location: result.woeid,
                            locationName: result.name,
                            currentCountry: result.country || "Worldwide",
                            searchQuery: ""
                        });
                        const nearbyLocations = await this.handleNearbyLocations(true);
                        this.setState({
                            nearbyLocations: this.shuffle(nearbyLocations)
                        });
                        await this.renderNearbyLocations();
                        await this.handleLocation(result.woeid);
                        let recent = localStorage.getItem("recentLocations");
                        if (recent) {
                            recent = JSON.parse(recent);
                        } else {
                            recent = [];
                        }
                        if (recent.indexOf(result.name) === -1) {
                            recent.push(result.name);
                        }
                        localStorage.setItem("recentLocations", JSON.stringify(recent));
                        const current = {
                            locationName: result.name,
                            locationID: result.woeid,
                            country: result.country,
                            allCities: result.placeType.name === "Country"
                        };
                        localStorage.setItem("currentLocation", JSON.stringify(current));
                        this.setState({recentLocations: recent});
                    }}>
                        {`${result.name}, ${result.country}`}
                    </div>
                ));
        }
        return jsx;
    }

    renderCityFields() { //! Sort alphabetically
        let cities = this.handleNearbyLocations(true);
        cities = cities.sort((a, b) => {
            const nameA = a
                .name
                .toLowerCase();
            const nameB = b
                .name
                .toLowerCase();
            if (nameA < nameB) 
                return -1;
            if (nameA > nameB) 
                return 1;
            return 0;
        });
        return cities.map((city, i) => <option key={`city${i}`} value={city.name}>{city.name}</option>);
    }

    renderTrends() {
        const {trends} = this.props;
        if (!this.props || trends === undefined) {
            return <div/>;
        }
        return (
            <div>
                {trends
                    .slice(0, 10)
                    .map((trend, i) => (
                        <div className="trends--trendContainer" key={i}>
                            <p className="trends--topTrendsName">
                                <a href={trend.url}>
                                    {trend.name}
                                </a>
                            </p>
                            {trend.tweet_volume !== null && (
                                <p className="trends--topTrendsCount">
                                    {Number(trend.tweet_volume).toLocaleString()}
                                    {" Tweets"}
                                </p>
                            )}
                        </div>
                    ))}
            </div>
        );
    }

    render() {

        const desktopStyles = {
            overlay: {
                backgroundColor: "rgba(17, 17, 17, 0.8)"
            },
            content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: "600px",
                height: "auto",
                padding: "16px 0"
            }
        };

        const {
            locationName,
            modalOpen,
            searchQuery,
            focused,
            recentLocations,
            searchLocation,
            searchCountry
        } = this.state;

        return (
            <div className="trends--container">
                <div className="trends--textContainer">
                    <h4 className="trends--headerText">
                        {`${locationName} trends`}
                    </h4>
                    <span className="trends--textSeperator">
                        {"·"}
                    </span>
                    <p className="trends--changeText" onClick={this.openModal}>
                        {"Change"}
                    </p>
                </div>
                {this.renderTrends()}
                <Modal isOpen={modalOpen} contentLabel="Trends" style={desktopStyles}>
                    <div className="trends--titleContainer">
                        <h4 className="trends--modalTitle text-center">Trends</h4>
                        <div onClick={this.closeModal}>
                            <i className="fas fa-times trends--closeModal"/>
                        </div>
                    </div>
                    <div className="trends--modalInputContainer">
                        <input
                            className="trends--searchTrendsInput"
                            value={searchQuery}
                            onChange={e => this.setState({searchQuery: e.target.value})}
                            placeholder="Search locations"
                            autoFocus
                            id="trends--searchInput"
                            onFocus={() => this.setState({focused: true})}
                            onBlur={() => {
                            setTimeout(() => {
                                this.setState({focused: false});
                            }, 200);
                        }}/> {focused && (
                            <div className="trends--searchResults">{this.renderSearchResults()}</div>
                        )}
                    </div>
                    <div className="trends--currentLocationContainer">
                        <p className="trends--currentLocation">Current Location: {locationName}</p>
                    </div>
                    {!searchLocation
                        ? (
                            <div>
                                {recentLocations.length > 0 && (
                                    <div className="trends--recentLocationsContainer">
                                        <h2 className="trends--recentLocationsTitle">Recent Locations</h2>
                                        <div className="row trends--row">
                                            {this.renderRecentLocations()}
                                        </div>
                                    </div>

                                )}
                                <div className="trends--nearbyLocationsContainer">
                                    <div className="trends--nearbyLocationsTitleContainer">
                                        <h2 className="trends--nearbyLocationsTitle">Nearby locations
                                        </h2>
                                        <span className="trends--textSeperator">
                                            {"·"}
                                        </span>
                                        <p
                                            className="trends--searchLocation"
                                            onClick={() => this.setState({searchLocation: true})}>
                                            Select your location
                                        </p>
                                    </div>
                                    <div className="row trends--row">
                                        {this.renderNearbyLocations()}
                                    </div>
                                </div>
                            </div>
                        )
                        : (
                            <div className="trends--searchLocationContainer">
                                <div className="trends--nearbyLocationsTitleContainer">
                                    <h2 className="trends--searchLocationsTitle">Select a location for your trends</h2>
                                    <span className="trends--textSeperator">
                                        {"·"}
                                    </span>
                                    <p
                                        className="trends--searchLocation"
                                        onClick={() => this.setState({searchLocation: false})}>
                                        Back
                                    </p>
                                </div>
                                <div className="trends--searchDropdownContainer">
                                    <div className="trends--dropdownContainer">
                                        <p className="trends--dropdownText">Region/Country:</p>
                                        <select
                                            onChange={e => {
                                            this.setState({searchCountry: e.target.value});
                                            this.renderCityFields();
                                        }}
                                            className="trends--dropdown">
                                            <option/> {countryList.map((country, i) => <option key={`country${i}`} value={country}>{country}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <p className="trends--dropdownText">City:</p>
                                        <select
                                            className="trends--dropdown"
                                            defaultValue=""
                                            onChange={async e => {
                                            const city = e.target.value;
                                            let data;
                                            if (searchCountry === city) {
                                                data = await this.searchLocation(searchCountry);
                                            } else {
                                                data = await this.searchLocation(city);
                                            }
                                            this.handleLocationClick(data[0]);
                                        }}>
                                            <option/> {searchCountry && <option value={searchCountry}>All Cities</option>}
                                            {searchCountry && this.renderCityFields()}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )
}
                    <div className="trends--buttonContainer">
                        <button type="button" className="button__signupLarge" onClick={this.closeModal}>
                            Done
                        </button>
                    </div>
                </Modal>
            </div>
        );
    }
}

Trends.propTypes = {
    trends: PropTypes
        .arrayOf(PropTypes.object)
        .isRequired,
    fetchTrends: PropTypes.func.isRequired
};

const mapStateToProps = ({auth, trends}) => ({auth, trends});

export default connect(mapStateToProps, actions)(Trends);
