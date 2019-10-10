// Built-in Node.js modules
var fs = require('fs')
var path = require('path')

// NPM modules
var express = require('express')
var sqlite3 = require('sqlite3')


var public_dir = path.join(__dirname, 'public');
var template_dir = path.join(__dirname, 'templates');
var db_filename = path.join(__dirname, 'db', 'usenergy.sqlite3');

var app = express();
var port = 8000;

// open usenergy.sqlite3 database
var db = new sqlite3.Database(db_filename, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.log('Error opening ' + db_filename);
    }
    else {
        console.log('Now connected to ' + db_filename);
    }
});

app.use(express.static(public_dir));


var statesList = [	'AL', 'AK', 'AZ', 'AR', 'CA', 'CO',
				'CT', 'DC', 'DE', 'FL', 'GA',
				'HI', 'ID', 'IL', 'IN', 'IA',
				'KS', 'KY', 'LA', 'ME', 'MD',
				'MA', 'MI', 'MN', 'MS', 'MO',
				'MT', 'NE', 'NV', 'NH', 'NJ',
				'NM', 'NY', 'NC', 'ND', 'OH',
				'OK', 'OR', 'PA', 'RI', 'SC', 
				'SD', 'TN', 'TX', 'UT', 'VT', 
				'VA', 'WA', 'WV', 'WI', 'WY'
			];



// GET request handler for '/'
app.get('/', (req, res) => {
		//console.log( req.params );
    ReadFile(path.join(template_dir, 'index.html')).then((template) => {
        let response = template;
	
       promiseCoal = new Promise( (resolve, reject) => {
	       db.all( `SELECT coal FROM Consumption WHERE year = 2017`, [], (err, data) => {
			if (err) { return console.error(err.message); }
			resolve(data);
		});
       });
       
       promiseNatural = new Promise( (resolve, reject) => {
	       db.all( `SELECT natural_gas FROM Consumption WHERE year = 2017`, [], (err, data) => {
			if (err) { return console.error(err.message); }
			resolve(data);
		});
       });
       
        promiseNuclear = new Promise( (resolve, reject) => {
	       db.all( `SELECT nuclear FROM Consumption WHERE year = 2017`, [], (err, data) => {
			if (err) { return console.error(err.message); }
			resolve(data);
		});
       });
       
        promisePetroleum = new Promise( (resolve, reject) => {
	       db.all( `SELECT petroleum FROM Consumption WHERE year = 2017`, [], (err, data) => {
			if (err) { return console.error(err.message); }
			resolve(data);
		});
       });
       
       promiseRenewable = new Promise( (resolve, reject) => {
	       db.all( `SELECT renewable FROM Consumption WHERE year = 2017`, [], (err, data) => {
			if (err) { return console.error(err.message); }
			resolve(data);
		});
       });

	Promise.all( [promiseCoal ,promiseNatural, promiseNuclear, promisePetroleum, promiseRenewable]).then( data =>{
		var total = 0;
		
		//console.log(data);
	
		for(var i=0; i< data[0].length; i++) total += data[0][i].coal;
		template = template.replace( "coal_count", "coal_count =" + total );
		total = 0;
		
		for(var i=0; i< data[1].length; i++) total += data[1][i].natural_gas;
		template = template.replace( "natural_count", "natural_count =" + total );
		total = 0;
		
		for(var i=0; i< data[2].length; i++) total += data[2][i].nuclear;
		template = template.replace( "nuclear_count", "nuclear_count =" + total );
		total = 0;
		
		for(var i=0; i< data[3].length; i++) total += data[3][i].petroleum;
		template = template.replace( "petroleum_count", "petroleum_count =" + total );
		total = 0;
		
		for(var i=0; i< data[4].length; i++) total += data[4][i].renewable;
		template = template.replace( "renewable_count", "renewable_count =" + total );
		total = 0;
				 
		console.log( template );
		WriteHtml(res, response);
	
	});
        
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/year/*'
app.get('/year/:selected_year', (req, res) => {
		console.log( req.params );
    ReadFile(path.join(template_dir, 'year.html')).then((template) => {
        let response = template;
        // modify `response` here
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/state/*'
app.get('/state/:selected_state', (req, res) => {
		console.log( req.params );
    ReadFile(path.join(template_dir, 'state.html')).then((template) => {
        let response = template;
        
	
	
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/energy-type/*'
app.get('/energy-type/:selected_energy_type', (req, res) => {
		console.log( req.params );
    ReadFile(path.join(template_dir, 'energy.html')).then((template) => {
        let response = template;
        // modify `response` here
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/prev/*'
app.get('/prev/:type/:current', (req, res) => {
		console.log( req.params );
    ReadFile(path.join(template_dir, req.params.type +'.html')).then((template) => {
        let response = template;
        // modify `response` here
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

// GET request handler for '/next/*'
app.get('/next/:type/:current', (req, res) => {
	console.log( req.params );
    ReadFile(path.join(template_dir, req.params.type +'.html')).then((template) => {
        let response = template;
        // modify `response` here
        WriteHtml(res, response);
    }).catch((err) => {
        Write404Error(res);
    });
});

function ReadFile(filename) {
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(data.toString());
            }
        });
    });
}

function Write404Error(res) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.write('Error: file not found');
    res.end();
}

function WriteHtml(res, html) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(html);
    res.end();
}


var server = app.listen(port);
