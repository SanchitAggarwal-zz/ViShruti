var http = require("http"),
	  express = require('express'),
    fs      = require('fs'),
	  path = require('path'),
	  mkdirp = require('mkdirp'),
	  bodyParser = require('body-parser'),
		url = require('url');

var app = express();
app.use(bodyParser());
app.set('port', process.env.PORT || 3000);

/* serve ViShruti page at Root*/
app.get('/', function (req, res) {
	res.sendfile(__dirname+'/public/'+'ViShruti.html');
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
			if (err){
				console.log('Error Occurred '+err);
				res.end('Error Occurred '+err);
			}
			else{
				console.log('The data is saved into file');
				res.end('The data is saved into file');
			}
		});
	});
});

/* Read ISI Details */
app.get('/read',function(req,res){
	var url_parts = url.parse(req.url,true);
	console.log(url_parts);
	var path = __dirname + '/ParticipantData/' + url_parts.query.Name;
	fs.exists(path, function( exists ) {
		if(exists){
			console.log(path + "File is there");
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
			console.log( path + "File is not there" );
			res.end(path + "File is not there");
		}
	});
});

/* Write Experiment Details */
app.post('/write',function(req,res){
	var path = __dirname + '/ParticipantData/' + req.body.Name;
	var data = req.body.data;
	fs.appendFile(path, data+'\n', function (err) {
		if (err){
			console.log('Error Occurred '+err);
			res.end('Error Occurred '+err);
		}
		else{
			console.log('The data is saved into file:' + path);
			res.end('The data is saved into file:' + path)
		}
	});
});

// To create and initialize files with headers.
app.post('/createFile',function(req,res){
	var flag  = false;
	var path = __dirname + '/ParticipantData/' + req.body.Name;
	var header = req.body.Header;
	fs.exists(path, function( exists ) {
		if(exists){
			console.log("File is there");
			fs.readFile(path, 'utf8', function (err, data) {
				if (err){
					console.log('Error Occurred '+err);
					res.end('Error Occurred '+err);
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
			res.end('"File is not there"');
		}
		if(!exists || flag){
			fs.appendFile(path, header+'\n', function (err) {
				if (err){
					console.log('Error Occurred '+err);
					res.end('Error Occurred '+err);
				}else{
					console.log(path + 'File is created with headers.');
					res.end(path + 'File is created with headers.')
				}
			});
		}
	});
});
// To create space for new participant
app.post('/createUser',function(req,res){
	var path = __dirname + '/ParticipantData/' + req.body.Name;
	fs.exists(path, function( exists ) {
		if(exists){
			console.log("Folder already Exists");
			res.end('"Folder already Exists"');
		}
		else{
			mkdirp(path, function (err) {
				if (err){
					console.error("Error occurred while creating Folder: "+err);
					res.end("Error occurred while creating Folder: "+err);
				}
				else {
					console.log( "Folder "+ path + "is created" );
					res.end( "Folder "+ path + "is created");
				}
		});
		}
	});
});

app.post('/saveImage',function(req,res){
	var path = __dirname + '/ParticipantData/' + req.body.Name;
	var img = req.body.image;
	// strip off the data: url prefix to get just the base64-encoded bytes
	var data = img.replace(/^data:image\/\w+;base64,/, "");
	var buf = new Buffer(data, 'base64');
	fs.writeFile(path, buf,function(err){
		if (err){
			console.error("Error occurred while saving image: "+err);
			res.end("Error occurred while saving image: "+err);
		}
		else {
			console.log( "Image "+ path + " is saved" );
			res.end( "Image "+ path + " is saved");
		}
	});
});
/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
	console.log('static file request : ' + req.params[0]);
	res.sendfile( __dirname + '/public/'+req.params[0]);

});

http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port') + "and server: http:localhost:3000/");
});