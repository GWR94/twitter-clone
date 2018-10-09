import twitterLocations from "./twitterLocations.json";

export default name => {
    const results = twitterLocations.filter(
        location => location.name.toLowerCase().indexOf(name.toLowerCase()) > -1,
    );
    return results;
};
