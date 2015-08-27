var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var mysql = require('mysql');
// try catch the database
try{
	var uristring = require('./mongolabinfo.js').name;
}
catch(err){
	console.log("no connection file so go on to Heroku config var");
	var uristring = process.env.MONGOLAB_URI;   //if Heroku env
}
console.log("uristring is "+ uristring);

// connect to the database
var db = mongoose.connect( uristring ); 
// SCHEMA









// Try PHPMYADMIN


var HOST = '198.90.23.189';
var PORT = 2083;
var MYSQL_USER = 'babethin';
var MYSQL_PASS = 'KHj6BdkFa';
var DATABASE = 'babethin_new-cart';
var TABLE = 'products';

var connection = mysql.createConnection({
    host: HOST,
    port: PORT,
    user: MYSQL_USER,
    password: MYSQL_PASS,
});
connection.connect();

connection.query()




// step one....list out the products when have in stock for babe


// step two......start to scan the barcodes and associate them with babe products 

// 

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/products', function(req, res, next){

})


module.exports = router;
