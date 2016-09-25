var express = require('express');
var router = express.Router();
var Mongo = require('./../mongo');

/* GET users listing. */
router.get('/', function(req, res, next) {
	Mongo.community.find({}, {
		lat: 1,
		lng: 1,
		price: 1,
		community_name: 1,
		_id: 0
	}, function(e, ds) {
		res.json(ds);
	})
});

module.exports = router;