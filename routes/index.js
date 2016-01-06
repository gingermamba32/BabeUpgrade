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
    box: {
    	type: Number, 
    	default: ''
    },
    created: {
        type: Date,
        default: Date.now
    }
});


// buttons page
router.get('/', function(req, res, next) {
	res.render('home');
})

/* GET home page with All Database Products*/
router.get('/scan', function(req, res, next) {
	// Locations.find( {}, function(err, docs) {
	// 	docs.reverse();
	res.render('index');
	});


router.get('/search', function(req, res, next) {
	res.render('search');
})

router.get('/addUpc', function(req, res, next) {
	res.render('upc');
})

router.get('/invalidInventory', function(req, res, next) {
	res.render('invalid');
})

router.get('/test', function(req, res, next) {
	res.render('test');
})

router.post('/radioSearch', function(req,res,next){
	globalColor = req.body.color;
	globalType = req.body.type;
	globalLength = req.body.length;
	globalUpc = '';
	globalDesc = '';
	globalLoc = '';
	globalQty = '';
	globalPo = '';

	console.log(globalColor);
	console.log(globalType);
	console.log(globalLength);

	console.log(req.body.length);
	console.log(req.body.type);
	console.log(req.body.color);


	
	//new RegExp("^"
	if (req.body.type == undefined && req.body.color == undefined){
		Locations.find({description: new RegExp("^" + req.body.length)}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query length');
			res.render('query', {'nums':docs});
		})

	}
	else if (req.body.length == undefined && req.body.color == undefined){
		Locations.find({description: new RegExp(req.body.type)}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query type');
			res.render('query', {'nums': docs});
		})
	}

	else if (req.body.length == undefined && req.body.type == undefined){
		Locations.find({description: new RegExp(req.body.color)}).sort({shipment: 1}).exec(function(err, docs){
			console.log( docs + ' good query color');
			res.render('query', {'nums': docs});
		})
	}
	else if (req.body.color == undefined){
		Locations.find({description: new RegExp("^" + req.body.length + "." + req.body.type)}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query length+type');
			res.render('query', {'nums':docs});
		})
	}
	else if (req.body.length == undefined){
		Locations.find({description: new RegExp(req.body.type + "\." + req.body.color + "\.$")}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query type + color');
			res.render('query', {'nums':docs});
		})
	}

	else if (req.body.type == undefined){
		Locations.find({description: new RegExp("^"+req.body.length + ".*" + req.body.color + "\.$")}).sort({shipment: 1}).exec(function(err, docs){
			console.log( docs + ' good query length + color');
			res.render('query', {'nums': docs});
		})
	}
	else {
	Locations.find({description: req.body.length + "." + req.body.type + "." + req.body.color + "."}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		});
	}
})

router.post('/addUpc', function(req, res,next){
	console.log(req.body.quantity);
	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
		if (docs != null) {
			res.redirect('/invalidInventory');
		}
		else {
			var newUpc = new Locations({
			upc        : req.body.upc,
			description: (req.body.description).toUpperCase(),
			location   : req.body.location,
			shipment   : req.body.po,
			quantity   : req.body.quantity
			});
							console.log(newUpc);
							newUpc.save(function(err, callback){
							res.render('upc', {successmessage: 'You have successfully added '+ req.body.description+ ' to the database.'});
							})
		}
	});
});


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
// router.post('/add', function(req, res, next ){
// 	console.log(req.body.barcodeupc);
// 	console.log(req.body.quantity);
// 	var qtyupdate = parseInt(req.body.quantity);
// 		Locations.findOneAndUpdate(
// 			{upc: req.body.barcodeupc},
//             {$inc: {
//                 	quantity     	  : qtyupdate
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document");
//             	res.redirect('/');
//             });          
// })


// router.post('/locate', function( req, res, next ){
// 	console.log(req.body.bin);
// 	console.log(req.body.productupc);
// 	console.log(req.body.qty);
// 	Locations.findOneAndUpdate(
// 		{location: req.body.bin, upc: req.body.productupc},  
// 		{$inc: {
//                 	quantity     	  : req.body.qty
//             }}, 
//             {upsert: false} , function(err, docs) {
//             	console.log( docs + " Updated Document by searching bin and upc");
//             	res.redirect('/');

// 	});
// })

// router.post('/locateMulti', function( req, res, next ){
// 	console.log(req.body);
// 	console.log(req.body.bin1);
// 	console.log(req.body.productupc1);
// 	console.log(req.body.qty1);
// 	console.log(req.body.productupc2);
// 	console.log(req.body.qty2);
// 	if ( req.body.productupc2 != '' && req.body.qty2 != ''){
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





router.post('/locateThree', function( req, res, next ){
	var num = new Date();
	var num = Date.now();
	console.log(Date.now())  
	console.log(num);//time stamp for box number
	console.log(typeof num);
	console.log(req.body);
	console.log(req.body.shipment)
	console.log(req.body.bin11);
	console.log(req.body.upc1);  //productupc11
	console.log(req.body.quantity1); //qty11
	console.log(req.body.upc2); //productupc22
	console.log(req.body.quantity2); //qty22

	// console.log(req.body.upc3);   //productupc33
	// console.log(req.body.quantity3); //qty33

	// if it is a string, there is only one entry and thus not an array
	if ( req.body.upc2 === '' && req.body.quantity2 === '' && req.body.upc3 === '' && req.body.quantity3 === '' && req.body.upc4 === '' && req.body.quantity4 === '' && req.body.upc5 === '' && req.body.quantity5 === ''&& req.body.upc6 === '' && req.body.quantity6 === '' && req.body.upc7 === '' && req.body.quantity7 === '' && req.body.upc8 === '' && req.body.quantity8 === ''){
					
					var num1 = Date.now(); 

            		Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num1
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
	 } 	//end of if statement
	else if (req.body.upc3 === '' && req.body.quantity3 === '' && req.body.upc4 === '' && req.body.quantity4 === '' && req.body.upc5 === '' && req.body.quantity5 === ''&& req.body.upc6 === '' && req.body.quantity6 === '' && req.body.upc7 === '' && req.body.quantity7 === '' && req.body.upc8 === '' && req.body.quantity8 === '') {
            		var num2 = Date.now();
            		Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num2
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num2
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
	
	} //end of else

	else if (req.body.upc4 === '' && req.body.quantity4 === '' && req.body.upc5 === '' && req.body.quantity5 === ''&& req.body.upc6 === '' && req.body.quantity6 === '' && req.body.upc7 === '' && req.body.quantity7 === '' && req.body.upc8 === '' && req.body.quantity8 === ''){
					var num3 = Date.now();

					Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num3
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num3
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc3}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc3 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2+ ' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc3,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity3,
								box        : num3
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});


	}


	else if (req.body.upc5 === '' && req.body.quantity5 === ''&& req.body.upc6 === '' && req.body.quantity6 === '' && req.body.upc7 === '' && req.body.quantity7 === '' && req.body.upc8 === '' && req.body.quantity8 === '') {
					var num4 = Date.now();

					Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num4
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num4
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc3}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc3 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2+ ' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc3,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity3,
								box        : num4
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc4}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc4 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3+' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc4,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity4,
								box        : num4
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' + req.body.upc4+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
	} 

	else if (req.body.upc6 === '' && req.body.quantity6 === '' && req.body.upc7 === '' && req.body.quantity7 === '' && req.body.upc8 === '' && req.body.quantity8 === '')  {
		var num5 = Date.now();

					Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num5
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num5
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc3}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc3 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2+ ' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc3,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity3,
								box        : num5
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc4}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc4 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3+' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc4,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity4,
								box        : num5
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' + req.body.upc4+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc5}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc5 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc5,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity5,
								box        : num5
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
	} //close of else

	else if (req.body.upc7 === '' && req.body.quantity7 === '' && req.body.upc8 === '' && req.body.quantity8 === '') {
					var num6 = Date.now();

					Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num6
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num6
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc3}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc3 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2+ ' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc3,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity3,
								box        : num6
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc4}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc4 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3+' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc4,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity4,
								box        : num6
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' + req.body.upc4+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc5}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc5 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc5,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity5,
								box        : num6
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc6}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc6 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 + ' and ' + req.body.upc5 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc6,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity6,
								box        : num6
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+' , ' + req.body.upc6 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
		} //end of else
	else if (req.body.upc8 === '' && req.body.quantity8 === '') {
					var num7 = Date.now();

					Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc3}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc3 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2+ ' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc3,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity3,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc4}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc4 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3+' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc4,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity4,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' + req.body.upc4+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc5}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc5 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc5,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity5,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc6}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc6 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 + ' and ' + req.body.upc5 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc6,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity6,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+' , ' + req.body.upc6 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

           		Locations.findOne({upc: req.body.upc7}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc7 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 + ' and ' + req.body.upc5 + ' and '+ req.body.upc6 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc7,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity7,
								box        : num7
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+' , ' + req.body.upc6 + ' , ' + req.body.upc7 +' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
		} //end of else

	else {
					var num8 = Date.now();

					Locations.findOne({upc: req.body.upc1}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc1,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity1,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' has been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc2}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc2 + ' does not exist. Only '+ req.body.upc1 + ' was added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc2,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity2,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc3}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc3 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2+ ' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc3,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity3,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc4}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc4 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3+' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc4,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity4,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' + req.body.upc4+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc5}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc5 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc5,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity5,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+ ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

            		Locations.findOne({upc: req.body.upc6}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc6 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 + ' and ' + req.body.upc5 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc6,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity6,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+' , ' + req.body.upc6 + ' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

           		Locations.findOne({upc: req.body.upc7}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc7 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 + ' and ' + req.body.upc5 + ' and '+ req.body.upc6 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc7,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity7,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								//res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+' , ' + req.body.upc6 + ' , ' + req.body.upc7 +' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});

           		Locations.findOne({upc: req.body.upc8}, function(err, docss) {
            			if (docss === null){
            				res.render('invalid', {message: req.body.upc8 + ' does not exist. Only '+ req.body.upc1 +' and ' +req.body.upc2 + ' and '+ req.body.upc3 + ' and ' +req.body.upc4 + ' and ' + req.body.upc5 + ' and '+ req.body.upc6 + ' and ' +req.body.upc7 +' were added. Please add it!'});
            			}
					    else { 
							var newLocation = new Locations({
								location   : req.body.bin11,
								upc        : req.body.upc8,
								description: docss.description,
								shipment   : req.body.shipment,
								quantity   : req.body.quantity8,
								box        : num8
							});
								console.log(newLocation);
							newLocation.save(function(err, callback){
								res.render('index', {success: req.body.upc1 + ' , ' +req.body.upc2 + ' , ' + req.body.upc3 + ' , ' +req.body.upc4+' , ' +req.body.upc5+' , ' + req.body.upc6 + ' , ' + req.body.upc7 + ' , '+ req.body.upc8+' have been successfully added to ' + req.body.bin11 + '/PO#' + req.body.shipment});
							})
						}
            		});
		} //close of else
});  //close of POST

		//UPDATE DOCUMENT BY CONDITIONS *************full scan
		// Locations.findOneAndUpdate(
		// {location: req.body.bin11, upc: req.body.upc1, shipment: req.body.shipment},  
		// {$inc: {
  //               	quantity     	  : req.body.quantity1
  //           }}, 
  //           {upsert: false} , function(err, docs) {
  //           	//console.log( docs + " Updated Document#1 by searching bin11 and upc11");
  //           	// res.redirect('/');
  //           	if (docs === null) {
  //           		Locations.findOne({upc: req.body.upc1}, function(err, docss) {
  //           				console.log(docss+ 'DOCCSSSSSSS')
		// 					if (docss === null){

  //           				res.render('invalid', {message: req.body.upc1 + ' does not exist. Please add it!'});
  //           				}
		// 			    	else { 
		// 						var newLocation = new Locations({
		// 						location   : req.body.bin11,
		// 						upc        : req.body.upc1,
		// 						description: docss.description,
		// 						shipment   : req.body.shipment,
		// 						quantity   : req.body.quantity1
		// 						});
		// 						console.log(newLocation);
		// 					newLocation.save(function(err, callback){
		// 				//res.redirect('/');
		// 					})
		// 					}
  //           		});
  //           	}
  //           	else {
  //           		console.log( docs + " Updated Document by searching bin and upc");
  //           	//res.redirect('/');
  //           	}

		// 	});
// // Sort by features
// router.post('/type', function( req, res, next ){
// 	console.log(req.body.type);
// 	Locations.find({type: req.body.type}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('type', { 'posts': docs });
// 	 });
// })

// router.post('/length', function( req, res, next ){
// 	console.log(req.body.length1);
// 	Locations.find({length: req.body.length1}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('length', { 'nums': docs });
// 	 });
// })

// router.post('/color', function( req, res, next ){
// 	console.log(req.body.color);
// 	Locations.find({color: req.body.color}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('color', { 'nums': docs });
// 	 });
// })

// // router.post('/location', function( req, res, next ){
// // 	console.log(req.body.location);
// // 	Locations.find({location: req.body.location}, function(err, docs) {
// // 			console.log( docs + 'good query');
// // 		res.render('location1', { 'nums': docs });
// // 	 });
// // })

// router.post('/qty', function( req, res, next ){
// 	console.log(req.body.qty);
// 	Locations.find({quantity: req.body.qty}, function(err, docs) {
// 			console.log( docs + 'good query');
// 		res.render('qty1', { 'nums': docs });
// 	 });
// })
// router.post('/upc', function( req, res, next ){
// 	console.log(req.body.barcode);

// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('upc1', {post:docs});
// 	 });
// })

// router.post('/po', function( req, res, next ){
// 	console.log(req.body.po);
// 	Locations.find({shipment: req.body.po}, function(err, docs) {
// 			console.log( docs + ' good query');
// 		res.render('po', {'nums':docs});
// 	 });
// })

// Full search feature....upc is unique and can only have one search function
router.post('/query', function(req,res,next){
	
	console.log(req.body.description);
	console.log(req.body.location);
	console.log(req.body.qty);
	console.log(req.body.barcode);
	console.log(req.body.po);

	globalUpc = req.body.barcode;
	globalDesc = (req.body.description).toUpperCase();
	globalLoc = req.body.location;
	globalQty = req.body.qty;
	globalPo = req.body.po;
	globalColor = undefined;
	globalType = undefined;
	globalLength = undefined;

	console.log(globalUpc); 
	console.log(globalDesc); 
	console.log(globalLoc + ' this is the global location now');
	console.log(globalQty);
	console.log(globalPo);
	if (req.body.barcode != '' && req.body.location != ''){
		Locations.find({upc: req.body.barcode, location: req.body.location}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.barcode != '' && req.body.description != ''){
		Locations.find({upc: req.body.barcode, description: new RegExp((req.body.description).toUpperCase())}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}

	else if (req.body.barcode != '' && req.body.qty != ''){
		Locations.find({upc: req.body.barcode, quantity: req.body.qty}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.barcode != '' && req.body.po != ''){
		Locations.find({upc: req.body.barcode, shipment: req.body.po}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.description != '' && req.body.location != ''){
		Locations.find({description: new RegExp((req.body.description).toUpperCase()), location: req.body.location}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.description != '' && req.body.qty != ''){
		Locations.find({description: new RegExp((req.body.description).toUpperCase()), quantity: req.body.qty}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.description != '' && req.body.po != ''){
		Locations.find({description: new RegExp((req.body.description).toUpperCase()), shipment: req.body.po}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.location != '' && req.body.qty != ''){
		Locations.find({location: req.body.location, quantity: req.body.qty}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.location != '' && req.body.po != ''){
		Locations.find({location: req.body.location, shipment: req.body.po}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	

	else if (req.body.qty != '' && req.body.po != ''){
		Locations.find({quantity: req.body.qty, shipment: req.body.po}).sort({shipment: 1}).exec(function(err,docs){
		console.log( docs + ' good query');
		res.render('query', {'nums':docs});	
		})
	}	


	else if (req.body.barcode != ''){
    Locations.find({upc: req.body.barcode}).sort({shipment: 1}).exec(function(err, docs) {
			console.log( docs + ' good query');
		res.render('query', {'nums':docs});
	 });
	}

// multi condition for the description field
	else if (req.body.description != ''){
		var reg = '22.SI.BURG.'
		console.log((reg.split('.').length -1) + ' HELLO');
		console.log(req.body.description.split('.').length -1);
		if ( ((req.body.description).split('.').length-1) === 3 ){
			Locations.find({description: new RegExp("^" + (req.body.description).toUpperCase() + '$')}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + ' good query');
				res.render('query', { 'nums': docs });
	 		});
		}
		else {
			Locations.find({description: new RegExp("^" + (req.body.description).toUpperCase())}).sort({shipment: 1}).exec(function(err, docs) {
			console.log( docs + ' good query');
			res.render('query', { 'nums': docs });
	 		});
		}
	}
	// ******************
	else if (req.body.location != '') {
		Locations.find({location: req.body.location}).sort({shipment: 1}).exec(function(err, docs) {
			console.log( docs + 'good query');
		res.render('query', { 'nums': docs });
	 });
	}

	else if (req.body.qty != ''){
		Locations.find({quantity: req.body.qty}).sort({shipment: 1}).exec(function(err, docs) {
			console.log( docs + 'good query');
		res.render('query', { 'nums': docs });
	 });
	}

	else if (req.body.po != ''){
		Locations.find({shipment: req.body.po}).sort({quantity: 1}).exec(function(err, docs) {
			console.log( docs + ' good query');
		res.render('query', {'nums':docs});
	 });
	}

	else if (req.body.po == '' && req.body.qty == '' && req.body.location == '' && req.body.description == '' && req.body.barcode == ''){
		res.render('search', {message: 'You have have not searched anything!'})
	}	

});





router.get('/deleteuser/:id', function(req, res){
	console.log(req.params.id);
	console.log(globalUpc); 
	console.log(globalDesc); 
	console.log(globalLoc);
	console.log(globalQty);
	console.log(globalPo);
	console.log(globalType);
	console.log(globalLength);
	console.log(globalColor);

	Locations.remove({ _id: req.params.id }, function(err, docs){

	// 	Locations.find({location: globalLoc, location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
	// 	console.log( docs + ' good query');
	// 	res.render('query', {'nums':docs});	
	// });
	// });
	// });
		if (globalLength != undefined && globalColor != undefined && globalType != undefined) {
		Locations.find({description: globalLength + "." + globalType + "." + globalColor + "."}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query all three modal');
			res.render('query', {'nums':docs});	
			});
		}	
		else if (globalUpc != '' && globalLoc != ''){
			Locations.find({upc: globalUpc, location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + upc');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalUpc != '' && globalDesc != ''){
			Locations.find({upc: globalUpc, description: new RegExp(globalDesc)}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query upc + description');
			res.render('query', {'nums':docs});	
			})
		}

		else if (globalUpc != '' && globalQty != ''){
			Locations.find({upc: globalUpc, quantity: globalQty}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query upc + qty');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalUpc != '' && globalPo != ''){
			Locations.find({upc: globalUpc, shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query upc + po');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalDesc != '' && globalLoc != ''){
			Locations.find({description: new RegExp(globalDesc), location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query desc + loc');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalDesc != '' && globalQty != ''){
			Locations.find({description: new RegExp(globalDesc), quantity: globalQty}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query desc + qty');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalDesc != '' && globalPo != ''){
			Locations.find({description: new RegExp(globalDesc), shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query desc + po');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalLoc != '' && globalQty != ''){
			Locations.find({location: globalLoc, quantity: globalQty}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + qty');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalLoc != '' && globalPo != ''){
			Locations.find({location: globalLoc, shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + po');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalQty != '' && globalPo != ''){
			Locations.find({quantity: globalQty, shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query + qty + po');
			res.render('query', {'nums':docs});	
			})
		}	


		else if (globalUpc != ''){
	    Locations.find({upc: globalUpc}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + ' good query upc');
			res.render('query', {'nums':docs});
		 });
		}

		else if (globalDesc != ''){
		Locations.find({description: new RegExp(globalDesc)}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + ' good query desc');
			res.render('query', { 'nums': docs });
		 });
		}

		else if (globalLoc != '') {
			Locations.find({location: globalLoc}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + 'good query loc');
			res.render('query', { 'nums': docs });
		 });
		}

		else if (globalQty != ''){
			Locations.find({quantity: globalQty}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + 'good query qty');
			res.render('query', { 'nums': docs });
		 });
		}

		else if (globalPo != ''){
			Locations.find({shipment: globalPo}).sort({quantity: 1}).exec(function(err, docs) {
				console.log( docs + ' good query po');
			res.render('query', {'nums':docs});
		 });
		}

		else if (globalLength != undefined && globalType != undefined){
			Locations.find({description: new RegExp("^" + globalLength + "." + globalType)}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query length type');
				res.render('query', {'nums':docs});
			})
		}
		else if (globalType != undefined && globalColor != undefined) {
			Locations.find({description: new RegExp(globalType + "\." + globalColor + "\.$")}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query type + color');
				res.render('query', {'nums':docs});
			})
		}

		else if (globalLength != undefined && globalColor != undefined){
			Locations.find({description: new RegExp("^"+globalLength + ".*" + globalColor + "\.$")}).sort({shipment: 1}).exec(function(err, docs){
				console.log( docs + ' good query length color');
				res.render('query', {'nums': docs});
			})
		}
		else if (globalLength != undefined){
			Locations.find({description: new RegExp("^" + globalLength)}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query length');
				res.render('query', {'nums':docs});
			})

		}
		else if (globalType != undefined){
			Locations.find({description: new RegExp(globalType)}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query type');
				res.render('query', {'nums': docs});
			})
		}

		else if (globalColor != undefined){
			Locations.find({description: new RegExp(globalColor)}).sort({shipment: 1}).exec(function(err, docs){
				console.log( docs + ' good query color');
				res.render('query', {'nums': docs});
			})
		}
	

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
				console.log(docs + " Updated Document");
		if (globalLength != undefined && globalColor != undefined && globalType != undefined) {
			Locations.find({description: globalLength + "." + globalType + "." + globalColor + "."}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query all three modal');
			res.render('query', {'nums':docs});	
			});
		}	
		else if (globalUpc != '' && globalLoc != ''){
			Locations.find({upc: globalUpc, location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + upc');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalUpc != '' && globalDesc != ''){
			Locations.find({upc: globalUpc, description: new RegExp(globalDesc)}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query upc + description');
			res.render('query', {'nums':docs});	
			})
		}

		else if (globalUpc != '' && globalQty != ''){
			Locations.find({upc: globalUpc, quantity: globalQty}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query upc + qty');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalUpc != '' && globalPo != ''){
			Locations.find({upc: globalUpc, shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query upc + po');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalDesc != '' && globalLoc != ''){
			Locations.find({description: new RegExp(globalDesc), location: globalLoc}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query desc + loc');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalDesc != '' && globalQty != ''){
			Locations.find({description: new RegExp(globalDesc), quantity: globalQty}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query desc + qty');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalDesc != '' && globalPo != ''){
			Locations.find({description: new RegExp(globalDesc), shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query desc + po');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalLoc != '' && globalQty != ''){
			Locations.find({location: globalLoc, quantity: globalQty}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + qty');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalLoc != '' && globalPo != ''){
			Locations.find({location: globalLoc, shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query loc + po');
			res.render('query', {'nums':docs});	
			})
		}	

		else if (globalQty != '' && globalPo != ''){
			Locations.find({quantity: globalQty, shipment: globalPo}).sort({shipment: 1}).exec(function(err,docs){
			console.log( docs + ' good query + qty + po');
			res.render('query', {'nums':docs});	
			})
		}	


		else if (globalUpc != ''){
	    Locations.find({upc: globalUpc}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + ' good query upc');
			res.render('query', {'nums':docs});
		 });
		}

		else if (globalDesc != ''){
		Locations.find({description: new RegExp(globalDesc)}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + ' good query desc');
			res.render('query', { 'nums': docs });
		 });
		}

		else if (globalLoc != '') {
			Locations.find({location: globalLoc}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + 'good query loc');
			res.render('query', { 'nums': docs });
		 });
		}

		else if (globalQty != ''){
			Locations.find({quantity: globalQty}).sort({shipment: 1}).exec(function(err, docs) {
				console.log( docs + 'good query qty');
			res.render('query', { 'nums': docs });
		 });
		}

		else if (globalPo != ''){
			Locations.find({shipment: globalPo}).sort({quantity: 1}).exec(function(err, docs) {
				console.log( docs + ' good query po');
			res.render('query', {'nums':docs});
		 });
		}

		else if (globalLength != undefined && globalType != undefined){
			Locations.find({description: new RegExp("^" + globalLength + "." + globalType)}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query length type');
				res.render('query', {'nums':docs});
			})
		}
		else if (globalType != undefined && globalColor != undefined) {
			Locations.find({description: new RegExp(globalType + "\." + globalColor + "\.$")}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query type + color');
				res.render('query', {'nums':docs});
			})
		}

		else if (globalLength != undefined && globalColor != undefined){
			Locations.find({description: new RegExp("^"+globalLength + ".*" + globalColor + "\.$")}).sort({shipment: 1}).exec(function(err, docs){
				console.log( docs + ' good query length color');
				res.render('query', {'nums': docs});
			})
		}
		else if (globalLength != undefined){
			Locations.find({description: new RegExp("^" + globalLength)}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query length');
				res.render('query', {'nums':docs});
			})

		}
		else if (globalType != undefined){
			Locations.find({description: new RegExp(globalType)}).sort({shipment: 1}).exec(function(err,docs){
				console.log( docs + ' good query type');
				res.render('query', {'nums': docs});
			})
		}

		else if (globalColor != undefined){
			Locations.find({description: new RegExp(globalColor)}).sort({shipment: 1}).exec(function(err, docs){
				console.log( docs + ' good query color');
				res.render('query', {'nums': docs});
			})
		}



    });          
})


// router.post('/location', function( req, res, next ){
// 	console.log(req.body.barcode);
// 	Locations.findOne({upc: req.body.barcode}, function(err, docs) {
// 			console.log( docs.upc + ' good upc');
// 			var newLocation = new Locations({
// 				location   : req.body.location,
// 				upc        : req.body.barcode,
// 				description: docs.description,
// 				shipment   : docs.shipment,
// 				quantity   : req.body.quantity
// 			});
// 				console.log(newLocation);
// 				newLocation.save(function(err, callback){
// 				res.redirect('/');
// 				})
// 	 });
// })

// search by multiple fields practice = need to create function to push into object for find
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