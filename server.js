var http = require("http"),
	express = require('express'),
	path = require('path');

var app = express();
app.set('port', process.env.PORT || 3000);

app.get('/', function (req, res) {
	res.sendfile(__dirname+'/public/ViShruti.html');
});

app.post("/user/add", function(req, res) {
	/* some server side logic */
	res.send("OK");
});

/* serves all the static files */
app.get(/^(.+)$/, function(req, res){
	console.log('static file request : ' + req.params);
	res.sendfile( __dirname + '/public/'+req.params[0]);
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});