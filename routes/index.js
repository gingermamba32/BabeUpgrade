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

// Query the database by Location and return all products in that location

// ********************************************
router.post('/queryLoc', function( req, res, next ){
	console.log(req.body.locations);
	Locations.find({location: req.body.locations}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('locsearch', { 'products': docs});
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

	});
})

router.post('/locateMulti', function( req, res, next ){
	console.log(req.body);
	console.log(req.body.bin1);
	console.log(req.body.productupc1);
	console.log(req.body.qty1);
	console.log(req.body.productupc2);
	console.log(req.body.qty2);
	if ( req.body.productupc2 != '' && req.body.qty2 != ''){
	Locations.findOneAndUpdate(
		{location: req.body.bin1, upc: req.body.productupc1},  
		{$inc: {
                	quantity     	  : req.body.qty1
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#1 by searching bin1 and upc1");
            	// res.redirect('/');
			});
	Locations.findOneAndUpdate(
		{location: req.body.bin1, upc: req.body.productupc2},  
		{$inc: {
                	quantity     	  : req.body.qty2
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#2 by searching bin1 and upc2");
            	res.redirect('/');
			});
	}
	else {
		Locations.findOneAndUpdate(
		{location: req.body.bin1, upc: req.body.productupc1},  
		{$inc: {
                	quantity     	  : req.body.qty1
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document by searching bin and upc");
            	res.redirect('/');
		});

	}
})





router.post('/locateThree', function( req, res, next ){
	console.log(req.body);
	console.log(req.body.bin11);
	console.log(req.body.productupc11);
	console.log(req.body.qty11);
	console.log(req.body.productupc22);
	console.log(req.body.qty22);
	console.log(req.body.productupc33);
	console.log(req.body.qty33);
	if ( req.body.productupc33 === '' && req.body.qty33 === '' && req.body.productupc22 === '' && req.body.qty22 === ''){
		Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc11},  
		{$inc: {
                	quantity     	  : req.body.qty11
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document by searching bin and upc");
            	res.redirect('/');
		});

	}
	else if (req.body.productupc33 === '' && req.body.qty33 === ''){
		Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc11},  
		{$inc: {
                	quantity     	  : req.body.qty11
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#1 by searching bin11 and upc11");
            	// res.redirect('/');
			});
	Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc22},  
		{$inc: {
                	quantity     	  : req.body.qty22
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#2 by searching bin11 and upc22");
            	res.redirect('/');
			});
	}

	else {
		Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc11},  
		{$inc: {
                	quantity     	  : req.body.qty11
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#1 by searching bin1 and upc11");
            	// res.redirect('/');
			});
	Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc22},  
		{$inc: {
                	quantity     	  : req.body.qty22
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#2 by searching bin1 and upc22");
			});
	Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc33},  
		{$inc: {
                	quantity     	  : req.body.qty33
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log( docs + " Updated Document#3 by searching bin11 and upc33");
            	res.redirect('/');
			});
	}
});


	







// 	if (req.body.productupc22 != '' && req.body.qty22 != '' && req.body.productupc33 != '' && req.body.qty33 != ''){
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin11, upc: req.body.productupc11},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty11
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#1 by searching bin1 and upc11");
//             	// res.redirect('/');
// 			});
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin11, upc: req.body.productupc22},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty22
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#2 by searching bin1 and upc22");
// 			});
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin11, upc: req.body.productupc33},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty33
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#3 by searching bin11 and upc33");
//             	res.redirect('/');
// 			});
// 	}

// 	else if ( req.body.productupc2 != '' && req.body.qty2 != ''){
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin1, upc: req.body.productupc1},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty1
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#1 by searching bin1 and upc1");
//             	// res.redirect('/');
// 			});
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin1, upc: req.body.productupc2},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty2
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document#2 by searching bin1 and upc2");
//             	res.redirect('/');
// 			});
// 	}
// 	else {
// 		Locations.findOneAndUpdate(
// 		{location: req.body.bin1, upc: req.body.productupc1},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty1
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document by searching bin and upc");
//             	res.redirect('/');
// 		});

// 	}
// })







module.exports = router;