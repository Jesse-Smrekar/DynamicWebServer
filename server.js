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


var statesList = [	'AL', 'AK', 'AZ', 'AR', 'CA', 
				'CO', 'CT', 'DC', 'DE', 'FL', 
				'GA', 'HI', 'ID', 'IL', 'IN', 
				'IA', 'KS', 'KY', 'LA', 'ME', 
				'MD', 'MA', 'MI', 'MN', 'MS', 
				'MO', 'MT', 'NE', 'NV', 'NH', 
				'NJ', 'NM', 'NY', 'NC', 'ND', 
				'OH', 'OK', 'OR', 'PA', 'RI', 
				'SC', 'SD', 'TN', 'TX', 'UT', 
				'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
			];

			
// GET request handler for '/'
app.get('/', (req, res) => {
	
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
	       
		promiseTable = new Promise( (resolve, reject) => {
			db.all( `SELECT * FROM Consumption WHERE year = 2017`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
		});



		Promise.all( [promiseCoal ,promiseNatural, promiseNuclear, promisePetroleum, promiseRenewable, promiseTable]).then( data =>{
			var total = 0;
			var tableString = '';
		
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
			
			for (const state in data[5]){
					tableString += '<tr><th>' + data[5][state].state_abbreviation + '</th><th>' + data[5][state].coal + '</th><th>' + data[5][state].natural_gas + '</th><th>' + data[5][state].nuclear + '</th><th>' + data[5][state].petroleum + '</th><th>' + data[5][state].renewable + '</th></tr>\n';
			}
			template = template.replace( "<!-- Data to be inserted here -->", tableString );
					
			//console.log(template);
			response = template;
			WriteHtml(res, response);

		
		});
		
	}).catch((err) => {
		Write404Error(res);
	});
	
});
    
    
// GET request handler for '/year/*'
app.get('/year/:selected_year', (req, res) => {
	
    ReadFile(path.join(template_dir, 'year.html')).then((template) => {
		let response = template;
		var prev;
		var next;
		prev = (Number(req.params.selected_year) -1);
		next = (Number(req.params.selected_year) +1);
		if (prev <= 1958)	res.Write404Error(); 

		if (next > 2018) res.Write404Error(); 

	
		template = template.replace( '<h2>National Snapshot</h2>', '<h2>' + req.params.selected_year + ' National Snapshot</h2>');
<<<<<<< HEAD
		template = template.replace( '<title>US Energy Consumption</title>', '<title>' + req.params.selected_year + ' US Energy Consumption</title>');
		template = template.replace( 'prev_placeholder">Prev</a>',  (Number(req.params.selected_year) -1) + '">' + prev + '</a>' );
		template = template.replace( 'next_placeholder">Next</a>',  (Number(req.params.selected_year) +1) + '">' + next + '</a>' );
	
	    promiseCoal = new Promise( (resolve, reject) => {
=======
		template = template.replace( /US Energy Consumption/g, req.params.selected_year + ' US Energy Consumption');
		template = template.replace( 'prev_placeholder">Prev</a>',  (Number(req.params.selected_year) -1) + '">' + (Number(req.params.selected_year) -1) + '</a>' );
		template = template.replace( 'next_placeholder">Next</a>',  (Number(req.params.selected_year) +1) + '">' + (Number(req.params.selected_year) +1) + '</a>' );
		template = template.replace( /year_placeholder/g , req.params.selected_year );
	       promiseCoal = new Promise( (resolve, reject) => {
>>>>>>> 59f6635c2e9a2e8a7c22704d1c781d513ce7b961
		       db.all( `SELECT coal FROM Consumption WHERE year = ` + req.params.selected_year, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
		});
	       
	    promiseNatural = new Promise( (resolve, reject) => {
		       db.all( `SELECT natural_gas FROM Consumption WHERE year = ` + req.params.selected_year, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
	    });
	       
		promiseNuclear = new Promise( (resolve, reject) => {
		       db.all( `SELECT nuclear FROM Consumption WHERE year = ` + req.params.selected_year, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
		});
	       
		promisePetroleum = new Promise( (resolve, reject) => {
		       db.all( `SELECT petroleum FROM Consumption WHERE year = ` + req.params.selected_year, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
	    });
	       
	    promiseRenewable = new Promise( (resolve, reject) => {
		       db.all( `SELECT renewable FROM Consumption WHERE year = ` + req.params.selected_year, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
				});
	 	});
	       
		promiseTable = new Promise( (resolve, reject) => {
			db.all( `SELECT * FROM Consumption WHERE year = ` + req.params.selected_year, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
		});



		Promise.all( [promiseCoal ,promiseNatural, promiseNuclear, promisePetroleum, promiseRenewable, promiseTable]).then( data =>{
			var total = 0;
			var tableString = '';
		
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
			
			for (const state in data[5]){
				total = data[5][state].coal + data[5][state].natural_gas + data[5][state].nuclear + data[5][state].petroleum + data[5][state].renewable;
				tableString += '<tr><th>' + data[5][state].state_abbreviation + '</th><th>' + data[5][state].coal + '</th><th>' + data[5][state].natural_gas + '</th><th>' + data[5][state].nuclear + '</th><th>' + data[5][state].petroleum + '</th><th>' + data[5][state].renewable + '</th><th>' + total + '</th></tr>\n';
			}
			template = template.replace( "<!-- Data to be inserted here -->", tableString );
					 
			response = template;
			console.log(template);

			WriteHtml(res, response);
		});
		
	}).catch((err) => {
		Write404Error(res);
	});
});



// GET request handler for '/state/*'
app.get('/state/:selected_state', (req, res) => {
	ReadFile(path.join(template_dir, 'state.html')).then((template) => {
		var prev;
		var next;
		
		prev = statesList.indexOf(req.params.selected_state) - 1;
		if( prev < 0) prev = 50;

		next = statesList.indexOf(req.params.selected_state) + 1;
		if( next > 50 ) next = 0; 
		
		template = template.replace( '<h2>Yearly Snapshot</h2>', '<h2>' + req.params.selected_state + ' Yearly Snapshot</h2>');
		template = template.replace( '<title>US Energy Consumption</title>', '<title>' + req.params.selected_state + ' US Energy Consumption</title>');
		template = template.replace( 'prev_placeholder">XX</a>',  (statesList[prev]) + '">' + (statesList[prev]) + '</a>' );
		template = template.replace( 'next_placeholder">XX</a>',  (statesList[next]) + '">' + (statesList[next]) + '</a>' );
		template = template.replace( 'noimage', req.params.selected_state);
<<<<<<< HEAD
		template = template.replace( 'NoImageAlt', req.params.selected_state +' State'); // have to change to full state name

		
=======
		template = template.replace( /state_placeholder/g, req.params.selected_state );

>>>>>>> 59f6635c2e9a2e8a7c22704d1c781d513ce7b961
	       promiseCoal = new Promise( (resolve, reject) => {
		       db.all( `SELECT coal FROM Consumption WHERE state_abbreviation = '` + req.params.selected_state + `'`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
				
			});
	       });
	       
	       promiseNatural = new Promise( (resolve, reject) => {
		       db.all( `SELECT natural_gas FROM Consumption WHERE state_abbreviation = '` + req.params.selected_state + `'`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
	       });
	       
		promiseNuclear = new Promise( (resolve, reject) => {
		       db.all( `SELECT nuclear FROM Consumption WHERE state_abbreviation = '` + req.params.selected_state + `'`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
	       });
	       
		promisePetroleum = new Promise( (resolve, reject) => {
		       db.all( `SELECT petroleum FROM Consumption WHERE state_abbreviation = '` + req.params.selected_state + `'`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
	       });
	       
	       promiseRenewable = new Promise( (resolve, reject) => {
		       db.all( `SELECT renewable FROM Consumption WHERE state_abbreviation = '` + req.params.selected_state + `'`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
				});
	       });
	       
		promiseTable = new Promise( (resolve, reject) => {
			db.all( `SELECT * FROM Consumption WHERE state_abbreviation = '` + req.params.selected_state + `'`, [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			//	console.log(data);
			});
		});

		Promise.all( [promiseCoal ,promiseNatural, promiseNuclear, promisePetroleum, promiseRenewable, promiseTable]).then( data =>{
			var array = [];
			var tableString = '';
			total = 0;
		
			//console.log( data[0][0].coal );
			for(var i=0; i< data[0].length; i++) array.push( data[0][i].coal );
			template = template.replace( "coal_counts", "coal_counts = [" + array.toString() + "]" );
			array = [];
			
			for(var i=0; i< data[1].length; i++) array.push( data[1][i].natural_gas );
			template = template.replace( "natural_counts", "natural_counts = [" + array.toString() + "]" );
			array = [];
			
			for(var i=0; i< data[2].length; i++) array.push( data[2][i].nuclear );
			template = template.replace( "nuclear_counts", "nuclear_counts = [" + array.toString() + "]" );
			array = [];
			
			for(var i=0; i< data[3].length; i++) array.push( data[3][i].petroleum );
			template = template.replace( "petroleum_counts", "petroleum_counts = [" + array.toString() + "]" );
			array = [];
			
			for(var i=0; i< data[4].length; i++) array.push( data[4][i].renewable );
			template = template.replace( "renewable_counts", "renewable_counts = [" + array.toString() + "]" );
			array = [];
			
			
			for (const year in data[5]){
				total = data[5][year].coal + data[5][year].natural_gas + data[5][year].nuclear + data[5][year].petroleum + data[5][year].renewable;
				tableString += '<tr><th>' + data[5][year].year + '</th><th>' + data[5][year].coal + '</th><th>' + data[5][year].natural_gas + '</th><th>' + data[5][year].nuclear + '</th><th>' + data[5][year].petroleum + '</th><th>' + data[5][year].renewable + '</th><th>' + total + '</th></tr>\n';
			}
			template = template.replace( "<!-- Data to be inserted here -->", tableString );
					 
<<<<<<< HEAD
			response = template;
			console.log(template);
=======
			let response = template;
			//console.log(template);
>>>>>>> 59f6635c2e9a2e8a7c22704d1c781d513ce7b961

			//WriteHtml(res, response);
		});
		
	}).catch((err) => {
		Write404Error(res);
	});
});










































// GET request handler for '/energy-type/*'
app.get('/energy-type/:selected_energy_type', (req, res) => {
	
	ReadFile(path.join(template_dir, 'energy.html')).then((template) => {
		var type = req.params.selected_energy_type;
		var result = '';
		var total = 0;
		var dataObj = {'AK':[], 'AL':[], 'AZ':[], 'AR':[], 'CA':[], 
				'CO':[], 'CT':[], 'DC':[], 'DE':[], 'FL':[], 
				'GA':[], 'HI':[], 'ID':[], 'IL':[], 'IN':[], 
				'IA':[], 'KS':[], 'KY':[], 'LA':[], 'ME':[], 
				'MD':[], 'MA':[], 'MI':[], 'MN':[], 'MS':[], 
				'MO':[], 'MT':[], 'NE':[], 'NV':[], 'NH':[], 
				'NJ':[], 'NM':[], 'NY':[], 'NC':[], 'ND':[], 
				'OH':[], 'OK':[], 'OR':[], 'PA':[], 'RI':[], 
				'SC':[], 'SD':[], 'TN':[], 'TX':[], 'UT':[], 
				'VT':[], 'VA':[], 'WA':[], 'WV':[], 'WI':[], 'WY':[]
				};
		
		template = template.replace( /type_placeholder/g, capitalize(req.params.selected_energy_type) );
		
      
		promiseTable = new Promise( (resolve, reject) => {
			db.all( `SELECT year, state_abbreviation, ` + req.params.selected_energy_type + ` FROM Consumption` , [], (err, data) => {
				if (err) { return console.error(err.message); }
				resolve(data);
			});
		}).then( data => {
				//console.log(data);
			
			for( var year =1960; year < 2018; year ++){
					result += '<tr><th>' + year + '</th>';
					for( var state in statesList){
						//console.log(state);
						for( var i=0; i < data.length; i ++){
								//console.log( type);
							if( data[i][type] == statesList[state]){
								
								//console.log(req.params.selected_energy_type);
								if(data[i].year == year){
									total += data[i][req.params.selected_energy_type];
									dataObj[stateList[state]].push(data[i][req.params.selected_energy_type]);
									console.log( 'State:', dataObj[statesList[state]] );
									console.log( 'value:', data[i][req.params.selected_energy_type] );
								}
							}
						}
					}
					
					result += '<th>' + total + '</th>' ;	
					total = 0;
				}
				result += '</tr>';
				template = template.replace( '<!-- Data to be inserted here -->', result );
				template = template.replace( 'arr_placeholder', JSON.stringify(dataObj));
				let response = template;
				WriteHtml(res, response);
			});
			//console.log(template);	
			//done
		
	}).catch((err) => {
		Write404Error(res);
	});
});//energy-type





































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

function capitalize(string){	//capitalizes the first char of a string
	return string.charAt(0).toUpperCase() + string.slice(1);
}
var server = app.listen(port);
