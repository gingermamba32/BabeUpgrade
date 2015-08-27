var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');


try{
	var uristring = require('./mongolabinfo.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var");
	var uristring = process.env.MONGOLAB_URI;   //if Heroku env
}

console.log("uristring is "+ uristring);

var db = mongoose.connect( uristring ); 




// SCHEMA



router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/products', function(req, res, next){

})


module.exports = router;
