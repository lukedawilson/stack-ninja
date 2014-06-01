var importer = require('./importer');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

app.get('/node/:id', importer.get);
app.post('/node', importer.post);
app.delete('/node/:id', importer.delete);

app.listen(4001);
console.log('listening on 4001...');

var webapp = express();
webapp.get('/', function (req, res) {
	console.log(req.originalUrl);
	res.send('Hello world');
});

webapp.listen(4000);
console.log('listening on 4000...');