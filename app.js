var neo4j = require('node-neo4j');
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser());

var db = new neo4j('http://192.168.63.4:7474');

app.get('/node/:id', function(req, res){
	db.readNode(req.params['id'], function(err, node) {
		if(err) res.send(500);
    	res.send(node);
    });
});

app.post('/node', function(req, res) {
	db.insertNode(req.body, function(err, node) {
    	if(err) res.send(500);
    	res.send(200);
	});
});

app.listen(4001);
