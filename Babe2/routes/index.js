var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');




// connect to the database
mongoose.connect( 'mongodb://gingermamba32:leigh1@ds035613.mongolab.com:35613/babedata' ); 

// var MongoClient = require('mongodb').MongoClient
//   , assert = require('assert');

// // Connection URL
// var url = 'mongodb://BIGTest:Pa55word!?@ds035543.mongolab.com:35543/babeproducts';
// // Use connect method to connect to the Server
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   console.log("Connected correctly to server");

//   db.close();
// });




/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'bbbbbbbb' });
});

module.exports = router;
