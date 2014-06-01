var util = require('util')
  , mu   = require('mu2');

mu.root = __dirname + '/views';

exports.index = function (req, res) {
  var stream = mu.compileAndRender('index.html', {name: "john"});
  util.pump(stream, res);
}