	var MongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	var ObjectId = require('mongodb').ObjectID;
	
	var url="mongodb://localhost:27017/local";
	MongoClient.connect(url, function(err, db) {
		if(err){
			console.log("error connecting to database: "+err);
		}
		else{
			console.log("Connected correctly to server.");
		}
		exports.db=db; 
	});
