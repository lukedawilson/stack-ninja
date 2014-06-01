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
