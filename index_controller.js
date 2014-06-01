var util = require('util')
  , mu   = require('mu2');

mu.root = __dirname + '/views';

exports.index = function (req, res) {
  var stream = mu.compileAndRender('index.html');
  util.pump(stream, res);
}

exports.fetch = function (req, res) {
	res.send("<p class='bg-warning text-warning'>No records found for user id!</p>");
}