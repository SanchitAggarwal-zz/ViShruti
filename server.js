var http = require("http"),
	  express = require('express'),
    fs      = require('fs'),
	  path = require('path');
	  mkdirp = require('mkdirp');
	  bodyParser = require('body-parser')

var app = express();
app.use(bodyParser());
app.set('port', process.env.PORT || 3000);

/* serve ViShruti page at Root*/
app.get('/', function (req, res) {
	res.sendfile(__dirname+'/public/'+'ViShruti.html');
});

/* Read Participant data */
app.get('/readParticipantDetails',function(req,res){
	var path = __dirname+'/ParticipantData/ParticipantDetails.csv';
	console.log('read file :'+ path);
	fs.exists(path, function( exists ) {
		if(exists){
			console.log("File is there");
			fs.readFile(path, 'utf8', function (err, data) {
				var msg = '';
				if (err){
					console.log('Error Occurred '+err);
					res.end(msg);
				}else{
					console.log('Data Read:\n'+ data);
					res.end(data);
				}
			});
		}
		else{
			console.log( "File is not there" );
		}
	});
});

/* Write Participant Data */
app.post('/writeParticipantDetails',function(req,res){
	var data = '';
	var path = __dirname+'/ParticipantData/ParticipantDetails.csv';
	req.on('data', function(chunk) {
		console.log("Received body data:");
		data += chunk.toString();
		console.log(chunk.toString());
	});
	req.on('end', function() {
		console.log(path);
		fs.appendFile(path, data+'\n', function (err) {
			if (err) throw err;
			console.log('The data is saved into file');
		});
		res.end('The data is saved into file');
	});
});

/* Read ISI Details */
app.get('/read',function(req,res){
	var path = __dirname + '/ParticipantData/' + req.body.File_Name;
	fs.exists(path, function( exists ) {
		if(exists){
			console.log("File is there");
			fs.readFile(path, 'utf8', function (err, data) {
				var msg = '';
				if (err){
					console.log('Error Occurred '+err);
					res.end(msg);
				}else{
					console.log('Data Read:\n'+ data);
					res.end(data);
				}
			});
		}
		else{
			console.log( "File is not there" );
		}
	});
});

// To create and initialize files with headers.
app.post('/initialize',function(req,res){
	var flag  = false;
	var path = __dirname + '/ParticipantData/' + req.body.File_Name;
	var header = req.body.Header;
	fs.exists(path, function( exists ) {
		if(exists){
			console.log("File is there");
			fs.readFile(path, 'utf8', function (err, data) {
				if (err){
					console.log('Error Occurred '+err);
				}else{
					console.log('Data Read:\n'+ data);
					if(data == '' || data == 'undefined'){
						flag = true;
					}
				}
			});
		}
		else{
			console.log( "File is not there" );
		}
		if(!exists || flag){
			fs.appendFile(path, header+'\n', function (err) {
				if (err) throw err;
				console.log('The Files are created with headers.');
				res.end('The Files are created with headers.')
			});
		}
	});
});
/* Write Experiment Details */
app.post('/write',function(req,res){
	var path = __dirname + '/ParticipantData/' + req.body.File_Name;
	var data = req.body.data;
	fs.appendFile(path, data+'\n', function (err) {
		if (err) throw err;
		console.log('The data is saved into file:' + path);
		res.end('The data is saved into file:' + path)
	});
});
// To create space for new participant
app.post('/createUser',function(req,res){
	var flag  = false;
	var path = __dirname + '/ParticipantData/' + req.body.Folder_Name;
	fs.exists(path, function( exists ) {
		if(exists){
			console.log("Folder already Exists");
		}
		else{
			mkdirp(path, function (err) {
				if (err) console.error("Error occurred while creating Folder: "+err);
				else console.log( "Folder "+ path + "is created" );
		});
		}
	});
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
	console.log('static file request : ' + req.params[0]);
	res.sendfile( __dirname + '/public/'+req.params[0]);

});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});