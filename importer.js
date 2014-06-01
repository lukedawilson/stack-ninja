var neo4j = require('node-neo4j');

var db = new neo4j('http://192.168.63.4:7474');

exports.get = function(req, res){
	db.readNode(req.params['id'], function(err, node) {
		if(err) res.send(500);
    	res.send(node);
    });
};

exports.post = function(req, res) {
	db.insertNode(req.body, function(err, node) {
    	if(err) res.send(500);
    	res.send(200);
	});
};

exports.delete = function(req, res) {
	db.deleteNode(req.params['id'], function(err, node) {
		if(err) res.send(500);
    	res.send(200);
    });
};
