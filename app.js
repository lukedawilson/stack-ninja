var importer = require('./importer');
var indexController = require('./index_controller');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

app.get('/node/:id', importer.get);
app.post('/node', importer.post);
app.delete('/node/:id', importer.delete);

app.listen(4001);
console.log('listening on 4001...');

var app2 = express();
app2.get('/', function (req, res) {
	console.log(req.originalUrl);
	indexController.index(req,res);
});
app2.post('/fetch', function (req, res) {
	console.log(req.originalUrl);
	indexController.fetch(req,res);
});

app2.listen(4000);
console.log('listening on 4000...');