const Twitter = require('twitter');
const keys = require('../config/keys');

module.exports = app => {
    const client = new Twitter({
        consumer_key: keys.consumer_key,
        consumer_secret: keys.consumer_secret,
        access_token_key: keys.access_token_key,
        access_token_secret: keys.access_token_secret,
    });

    const locations = {
        London: 44418,
        Cardiff: 15127,
        NewYork: 2459115,
        LosAngeles: 2442047,
        Barcelona: 20223493,
        Madrid: 766273,
        Sydney: 1105779,
    }

    Kkll1Te39Fm116fgSscxE2goB

};