const Twitter = require('twitter');
const keys = require('../config/keys');

module.exports = (app) => {
	const client = new Twitter({
		consumer_key: keys.consumer_key,
		consumer_secret: keys.consumer_secret,
		access_token_key: keys.access_token_key,
		access_token_secret: keys.access_token_secret
	});

	app.get('/api/get_trends/:location', (req, res) => {
		const params = {
			id: req.params.location
		};
		client.get('/trends/place', params, function(error, trends) {
			if (error) throw error;
			return res.send(trends[0].trends);
		});
    });
};
