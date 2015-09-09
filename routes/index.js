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
	shipment: {
        type: String,
        default: '',
        required: 'PO # HERE',
        trim: false
        },
    type: {
        type: String,
        default: '',
        required: 'Please Enter the UPC',
        trim: false
        },
    length: {
        type: String,
        default: '',
        required: 'Please Enter the UPC',
        trim: false
        },
    color: {
        type: String,
        default: '',
        required: 'Please Enter the UPC',
        trim: false
        },
    location: {
        type: String,
        default: '',
        required: 'RACK LOCATION HERE',
        trim: false
        },
    quantity: {
        type: Number,
        default: '',
        required: 'QTY?',
        trim: false
    },
    created: {
        type: Date,
        default: Date.now
    }
});



/* GET home page. */
router.get('/', function(req, res, next) {
	Locations.find( {}, function(err, docs) {
		docs.reverse();
		console.log(docs + "products");
	res.render('index', { 'products': docs });
	});


})



module.exports = router;
