var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// try catch the database
try{
	var uristring = require('./mongolabsuri.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var");
	var uristring = process.env.MONGOLAB_URI;   //if Heroku env set the config variable
}
console.log("uristring is "+ uristring);

var db = mongoose.connect( uristring);

// db schema for the locations collection
var Locations = db.model('location', { 
	upc: {
		type: String,
		default: ''
	}	,
	shipment: {
        type: String,
        default: ''
        },
    type: {
        type: String,
        default: ''
        },
    length: {
        type: String,
        default: ''
        },
    color: {
        type: String,
        default: ''
        },
    location: {
        type: String,
        default: ''
        },
    quantity: {
        type: Number,
        default: ''
        },
    created: {
        type: Date,
        default: Date.now
    }
});



/* GET home page with product list*/
router.get('/', function(req, res, next) {
	Locations.find( {}, function(err, docs) {
		docs.reverse();
		// console.log(docs + "products");
	res.render('index', { 'products': docs });
	});


})

router.post('/query', function( req, res, next){
	console.log(req.body.barcode);
	// if(req.body.barcode) {
	// 	Locations.find( {upc: req.body.barcode}, function(err, docs) {
	// 		console.log(docs + ' upc query');
	// 	}
	// 	res.render('upcsearch', { 'query': docs });
	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('upcsearch', {post:docs});
	 });
})

// router.get('/upcsearch', function(req, res, next){
// 	// console.log(req.params.id);
// 	console.log(req.body.barcode + ' hello');
// 	Locations.find( {upc: req.body.barcode}, function(err, docs){
// 		// console.log(docs);
// 		res.render('upcsearch.jade', {post: docs})
// 	})
// })






module.exports = router;
