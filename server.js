var http = require("http"),
	  express = require('express'),
    fs      = require('fs'),
	  path = require('path');
	  mkdirp = require('mkdirp');

var app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
	res.sendfile(__dirname+'/public/'+'ViShruti.html');
});


app.post('/saveExperimentData',function(req,res){
	mkdirp(__dirname+'/ParticipantData/Sanchit', function (err) {
		if (err) console.error('errroorrr');
		else console.log('pow!')
	});
});


app.get('/readParticipantData',function(req,res){
	console.log('read file :'+ __dirname+'/ParticipantData/ParticipantDetails.csv');
	fs.readFile(__dirname+'/ParticipantData/ParticipantDetails.csv', 'utf8', function (err, data) {
		if (err){
			if(err.errno==34){
				res.end('No such file exist , error:' + err);
			}
		}else{
			console.log('read: '+ data);
			res.end(data);
		}
	});
});

	app.post('/writeParticipantData',function(req,res){
		var data = '';
		req.on('data', function(chunk) {
			console.log("Received body data:");
			data += chunk;
			console.log(chunk.toString());
		});

		req.on('end', function() {
			console.log(__dirname+'/ParticipantData/ParticipantDetails.csv');
			fs.appendFile(__dirname+'/ParticipantData/ParticipantDetails.csv', data, function (err) {
				if (err) throw err;
				console.log('The data is saved into file');
			});
			res.end();
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