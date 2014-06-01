var neo4j = require('node-neo4j');
var async = require('async')

var db = new neo4j('http://192.168.63.4:7474');

var data = 
	{
		post: {
			id: 2,
			name: "Luca"
		},
		tags: ["python", "linux"]
	};

//sync(db, 'insertNode');

var handleTags = function(tags, fn, callback) {
	async.map(tags, fn, callback);
}

var handleData = function(data, callback) {
	db.insertNode(data.post, callback);
}

var upsertTag = function(tag, callback) {
	db.cypherQuery(
		'MERGE(x {type: {type}, name: {name} }) RETURN x',
		{ type: "tag", name: tag },
		function(err, data) {
			if (err) return callback(err);
			return callback(null, data.data[0]._id);
		});
}

var createLink = function(node_id, tag_id, callback) {
	console.log(node_id);
	console.log(tag_id);
	db.insertRelationship(
		node_id, tag_id, 'RELATIONSHIP_TYPE', {name:tag_id}, function(err, rel) {
			if (err) return callback(err);
			//console.log(rel);
			return callback();
		});
}

var createLinks = function(tag_ids, fn, callback) {
	async.each(tag_ids, fn, callback);
}

handleData(data, function(err, node) {
	handleTags(data.tags, upsertTag, function(err, tag_ids) {
		if (err) throw err;
		createLinks(tag_ids, 
			function(id, callback) {
		    	//console.log(id);
				createLink(node.id, id, callback);
		 	}, 
			function(err) {
				//if (err) console.log(err);
				//else console.log(node._id);
			});
	});
});