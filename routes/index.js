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
	description: {
		type: String,
		default: ''
	}	,
	shipment: {
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

router.get('/upc', function(req, res, next) {
	res.render('upc');
})

// router.get('/location', function(req, res, next) {
// 	res.render('location');
// })

router.get('/qty', function(req, res, next) {
	res.render('qty');
})

// // Query the database by UPC and return 
// router.post('/query1', function( req, res, next ){
// 	console.log(req.body.barcode);
// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('upcsearch', {post:docs});
// 	 });
// })

// Query the database by Location and return all products in that location

// // ********************************************
// router.post('/queryLoc', function( req, res, next ){
// 	console.log(req.body.locations);
// 	Locations.find({location: req.body.locations}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('locsearch', { 'products': docs});
// 	 });
// })

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
            	// console.log(docs + 'xxxxxx');
            	console.log(req.body.productupc11);
            	if (docs === null) {
            		Locations.findOne({upc: req.body.productupc11}, function(err, docss) {
					console.log( docss.upc + ' good upc');
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.productupc11,
								description: docss.description,
								shipment   : docss.shipment,
								quantity   : req.body.qty11
							});
						console.log(newLocation);
						newLocation.save(function(err, callback){
						res.redirect('/');
						})

            		});
            	}
            	else {
            		console.log( docs + " Updated Document by searching bin and upc");
            	res.redirect('/');
            	}

		});
	}
	// end of if statement
	else if (req.body.productupc33 === '' && req.body.qty33 === ''){
		Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc11},  
		{$inc: {
                	quantity     	  : req.body.qty11
            }}, 
            {upsert: false} , function(err, docs) {
            	//console.log( docs + " Updated Document#1 by searching bin11 and upc11");
            	// res.redirect('/');
            	if (docs === null) {
            		Locations.findOne({upc: req.body.productupc11}, function(err, docss) {
					console.log( docss.upc + ' good upc');
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.productupc11,
								description: docss.description,
								shipment   : docss.shipment,
								quantity   : req.body.qty11
							});
						console.log(newLocation);
						newLocation.save(function(err, callback){
						//res.redirect('/');
						})

            		});
            	}
            	else {
            		console.log( docs + " Updated Document by searching bin and upc");
            	//res.redirect('/');
            	}

			});
	Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc22},  
		{$inc: {
                	quantity     	  : req.body.qty22
            }}, 
            {upsert: false} , function(err, docs) {
            	//console.log( docs + " Updated Document#2 by searching bin11 and upc22");
            	//res.redirect('/');
            	if (docs === null) {
            		Locations.findOne({upc: req.body.productupc22}, function(err, docss) {
					console.log( docss.upc + ' good upc');
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.productupc22,
								description: docss.description,
								shipment   : docss.shipment,
								quantity   : req.body.qty22
							});
						console.log(newLocation);
						newLocation.save(function(err, callback){
						res.redirect('/');
						})

            		});
            	}
            	else {
            		console.log( docs + " Updated Document by searching bin and upc");
            		res.redirect('/');
            	}
			});
	}

	else {
		Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc11},  
		{$inc: {
                	quantity     	  : req.body.qty11
            }}, 
            {upsert: false} , function(err, docs) {
            	//console.log( docs + " Updated Document#1 by searching bin1 and upc11");
            	// res.redirect('/');
            	if (docs === null) {
            		Locations.findOne({upc: req.body.productupc11}, function(err, docss) {
					console.log( docss.upc + ' good upc');
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.productupc11,
								description: docss.description,
								shipment   : docss.shipment,
								quantity   : req.body.qty11
							});
						console.log(newLocation);
						newLocation.save(function(err, callback){
						//res.redirect('/');
						})

            		});
            	}
            	else {
            		console.log( docs + " Updated Document by searching bin and upc");
            	//res.redirect('/');
            	}
			});
	Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc22},  
		{$inc: {
                	quantity     	  : req.body.qty22
            }}, 
            {upsert: false} , function(err, docs) {
            	//console.log( docs + " Updated Document#2 by searching bin1 and upc22");
            	if (docs === null) {
            		Locations.findOne({upc: req.body.productupc11}, function(err, docss) {
					console.log( docss.upc + ' good upc');
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.productupc22,
								description: docss.description,
								shipment   : docss.shipment,
								quantity   : req.body.qty22
							});
						console.log(newLocation);
						newLocation.save(function(err, callback){
						//res.redirect('/');
						console.log(callback)
						})

            		});
            	}
            	else {
            		console.log( docs + " Updated Document by searching bin and upc");
            	//res.redirect('/');
            	}
			});
	Locations.findOneAndUpdate(
		{location: req.body.bin11, upc: req.body.productupc33},  
		{$inc: {
                	quantity     	  : req.body.qty33
            }}, 
            {upsert: false} , function(err, docs) {
            	//console.log( docs + " Updated Document#3 by searching bin11 and upc33");
            	//res.redirect('/');
            	if (docs === null) {
            		Locations.findOne({upc: req.body.productupc11}, function(err, docss) {
					console.log( docss.upc + ' good upc');
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.productupc33,
								description: docss.description,
								shipment   : docss.shipment,
								quantity   : req.body.qty33
							});
						console.log(newLocation);
						newLocation.save(function(err, callback){
						res.redirect('/');
						})

            		});
            	}
            	else {
            		console.log( docs + " Updated Document by searching bin and upc");
            		res.redirect('/');
            	}
			});
	}
});

// Sort by features
router.post('/type', function( req, res, next ){
	console.log(req.body.type);
	Locations.find({type: req.body.type}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('type', { 'posts': docs });
	 });
})

router.post('/length', function( req, res, next ){
	console.log(req.body.length1);
	Locations.find({length: req.body.length1}, function(err, docs) {
			console.log( docs + 'good query');
		res.render('length', { 'nums': docs });
	 });
})

router.post('/color', function( req, res, next ){
	console.log(req.body.color);
	Locations.find({color: req.body.color}, function(err, docs) {
			console.log( docs + 'good query');
		res.render('color', { 'nums': docs });
	 });
})

// router.post('/location', function( req, res, next ){
// 	console.log(req.body.location);
// 	Locations.find({location: req.body.location}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('location1', { 'nums': docs });
// 	 });
// })

router.post('/qty', function( req, res, next ){
	console.log(req.body.qty);
	Locations.find({quantity: req.body.qty}, function(err, docs) {
			console.log( docs + 'good query');
		res.render('qty1', { 'nums': docs });
	 });
})
router.post('/upc', function( req, res, next ){
	console.log(req.body.barcode);

	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('upc1', {post:docs});
	 });
})

router.post('/po', function( req, res, next ){
	console.log(req.body.po);
	Locations.find({shipment: req.body.po}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('po', {'nums':docs});
	 });
})

// Full search feature....upc is unique and can only have one search function
router.post('/query', function(req,res,next){
	
	console.log(req.body.description);
	console.log(req.body.location);
	console.log(req.body.qty);
	console.log(req.body.barcode);
	console.log(req.body.po);
	if (req.body.barcode != '' && req.body.location != ''){
		Locations.find({upc: req.body.barcode, location: req.body.location}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.barcode != '' && req.body.description != ''){
		Locations.find({upc: req.body.barcode, description: req.body.description}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}

	else if (req.body.barcode != '' && req.body.qty != ''){
		Locations.find({upc: req.body.barcode, quantity: req.body.qty}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.barcode != '' && req.body.po != ''){
		Locations.find({upc: req.body.barcode, shipment: req.body.po}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.description != '' && req.body.location != ''){
		Locations.find({description: req.body.description, location: req.body.location}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.description != '' && req.body.qty != ''){
		Locations.find({description: req.body.description, quantity: req.body.qty}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.description != '' && req.body.po != ''){
		Locations.find({description: req.body.description, shipment: req.body.po}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.location != '' && req.body.qty != ''){
		Locations.find({location: req.body.location, quantity: req.body.qty}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.location != '' && req.body.po != ''){
		Locations.find({location: req.body.location, shipment: req.body.po}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.qty != '' && req.body.po != ''){
		Locations.find({quantity: req.body.qty, shipment: req.body.po}, function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	


	else if (req.body.barcode != ''){
    Locations.find({upc: req.body.barcode}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('query', {'nums':docs});
	 });
	}

	else if (req.body.description != ''){
	Locations.find({description: req.body.description}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('query', { 'nums': docs });
	 });
	}

	else if (req.body.location != '') {
		Locations.find({location: req.body.location}, function(err, docs) {
			console.log( docs + 'good query');
		res.render('query', { 'nums': docs });
	 });
	}

	else if (req.body.qty != ''){
		Locations.find({quantity: req.body.qty}, function(err, docs) {
			console.log( docs + 'good query');
		res.render('query', { 'nums': docs });
	 });
	}

	else if (req.body.po != ''){
		Locations.find({shipment: req.body.po}, function(err, docs) {
			console.log( docs + ' good query');
		res.render('query', {'nums':docs});
	 });
	}



	

});





router.get('/deleteuser/:id', function(req, res){
	console.log(req.params.id);
	Locations.remove({ _id: req.params.id }, function(){
		res.redirect('/');
	});
});

router.get('/updateproduct/:id', function(req, res){
	Locations.find({_id: req.params.id}, function(err, docs){
		console.log(docs + ' User to edit');
		res.render('editproduct', { post:docs } );
	});
});

router.post('/update', function(req, res){
	console.log(req.body.id + ' Hello');
	Locations.findOneAndUpdate(
		{_id: req.body.id},
		{$set: {
                	_id     	       : req.body.id,
                    upc      	  	   : req.body.barcode,
                    description 	   : req.body.description,
                    location           : req.body.location,
                    quantity           : req.body.qty,
                    shipment 	       : req.body.po 
            }}, 
            {upsert: false} , function(err, docs) {
            	console.log(docs + "Updated Document");
            	res.redirect('/');
            });          
})


router.post('/location', function( req, res, next ){
	console.log(req.body.barcode);
	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
			console.log( docs.upc + ' good upc');
			var newLocation = new Locations({
				location   : req.body.location,
				upc        : req.body.barcode,
				description: docs.description,
				shipment   : docs.shipment,
				quantity   : req.body.quantity
			});
				console.log(newLocation);
				newLocation.save(function(err, callback){
				res.redirect('/');
				})
	 });
})

// search by multiple fields
// router.post('/queryTest', function(req,res,next){
// 		console.log(req.body.description);
// 		console.log(req.body.location);
// 		console.log(req.body.qty);
// 		console.log(req.body.barcode.length);
// 		console.log(req.body.po);
// 		var upc;
// 		var description;
// 		var location;
// 		var quantity;
// 		var po;
// 		if (req.body.barcode != ''){
// 			var upc = req.body.barcode;
// 		}
// 		else {
// 			var upc = null;
// 		}

// 		if (req.body.location != ''){
// 			var location = req.body.location;
// 		}
// 		else {
// 			var location = null;
// 		}
// 		console.log(upc);
// 		//assign var declarations
// 		Locations.find({$and: [ {upc: upc, location: location}, {upc: {$where: {upc:{$ne:null}}}}, {location: {$where: {location:{$ne:null}}}}]}, 
// 		 function(err,docs){
// 			console.log(docs+' TESTTTTTTT');

// 			res.render('query', {'nums':docs})
// 		})


// });

module.exports = router;