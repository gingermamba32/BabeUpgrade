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



/* GET home page with All Database Products*/
router.get('/', function(req, res, next) {
	Locations.find( {}, function(err, docs) {
		docs.reverse();
	res.render('index', { 'products': docs });
	});
})

// Query the database by UPC and return 
router.post('/query', function( req, res, next ){
	console.log(req.body.barcode);
	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('upcsearch', {post:docs});
	 });
})


// adding quantity = add success message 
router.post('/add', function(req, res, next ){
	console.log(req.body.barcodeupc);
	console.log(req.body.quantity);
	var qtyupdate = parseInt(req.body.quantity);
		Locations.findOneAndUpdate(
			{upc: req.body.barcodeupc},
            {$inc: {
                	quantity     	  : qtyupdate
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document");
            	res.redirect('/');
            });          
})


router.post('/locate', function( req, res, next ){
	console.log(req.body.bin);
	console.log(req.body.productupc);
	console.log(req.body.qty);
	Locations.findOneAndUpdate(
		{location: req.body.bin, upc: req.body.productupc},  
		{$inc: {
                	quantity     	  : req.body.qty
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document by searching bin and upc");
            	res.redirect('/');
		// console.log(docs + ' This is what is in this bin');
		// // res.render('binsearch', {'products':docs});

		// res.redirect('/');
	});
})

router.post('/locate2', function( req, res, next ){
	console.log(req.body.bin);
	console.log(req.body.productupc);
	console.log(req.body.qty);
	Locations.findOneAndUpdate(
		{location: req.body.bin, upc: req.body.productupc},  
		{$inc: {
                	quantity     	  : req.body.qty
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document by searching bin and upc");
            	res.redirect('/');
		// console.log(docs + ' This is what is in this bin');
		// // res.render('binsearch', {'products':docs});

		// res.redirect('/');
	});
})







module.exports = router;
