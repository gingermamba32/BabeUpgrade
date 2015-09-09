var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

// try catch the database
try{
	var uristring = require('./mongolabsuri.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var");
	var uristring = process.env.MONGOLAB_URI;   //if Heroku env
}
console.log("uristring is "+ uristring);


// // connect to the database
// mongoose.connect( 'mongodb://gingermamba32:leigh1@ds035613.mongolab.com:35613/babedata' ); 




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bbbbbbbb' });
});

module.exports = router;
