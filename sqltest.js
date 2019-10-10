// Built-in Node.js modules
var fs = require('fs')
var path = require('path')

// NPM modules
var express = require('express')
var sqlite3 = require('sqlite3')
//var Promise = require('promise')

var public_dir = path.join(__dirname, 'public');
var template_dir = path.join(__dirname, 'templates');
var db_filename = path.join(__dirname, 'db', 'usenergy.sqlite3');

var app = express();

// open usenergy.sqlite3 database
var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

//let sql = `SELECT coal FROM Consumption WHERE year = 2017`;
//let coalId = 1;
 
 
 
 
 
 
 
 
 
 
 
 /*
 
 //pass method as either "single" OR "sum" 
 function queryData( table, column, where, method){ 
	var total = 0;
 
	return new Promise( function(res, rej) {
 
		db.all("SELECT " + column + " FROM " + table + " WHERE " +  where , [], (err, row) => {
			 if (err) {
				return console.error(err.message);
			 }
			
			else if( method == "single" ){
				console.log(row);
				return row;
			}
			
			else if( method == "sum") {
				row.forEach( (row) => {
					total += row[column];
					console.log(row.coal)
				});
				
			  console.log( '\n\n','total:', total );
			  return total;
			} 
			
			
			else{
				console.log("queryData.method must be either \'sum\' or \'single\' -- input was:", method); 
				return 0;
			}
		});
	});
 }
 
var query = queryData( 'Consumption', 'coal', 'year = 2017', 'sum')
.then( function(res) {
	console.log("result:", query);
	console.log ("inside");

 });
 
 */
 
 function sumQueryData( table, column, where){ 
	var total = 0;
	var row_arr = [];
 
	total = db.all("SELECT " + column + " FROM " + table + " WHERE " +  where , [], (err, data) => {
		 if (err) {
			return console.error(err.message);
		 }
		var count = 0;
		data.forEach( (row) => {
			console.log(row.state_abbreviation, row.coal)	
			//console.log(sumQueryData.total);
			//return row[column];
			//row_arr.push(row[column]);
			//count += row;
			
		});
		//console.log( '\n\n','total:', total );
	});
	
	for( var i=0; i < row_arr.length; i++){
	

		total += row;
		console.log(row);
	
	}	
	return total;
 }
 
 
 console.log(sumQueryData( 'Consumption', '*', 'year = 2017'));
 
 