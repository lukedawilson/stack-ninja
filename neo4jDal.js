var neo4j = require('node-neo4j'),
  asyncq = require('async-q'),
  Q = require('q'),
  db = new neo4j();

var data = {
  post: {
    id: 2,
    name: "Luca"
  },
  tags: ["python", "linux"]
};

var datas = [
  data,
  {
    post: {
      id: 3,
      name: "Marco"
    },
    tags: ["python", "linux", "C#"]
  }
];

db.createUniquenessContstraint('Post', 'id', function (err, result) { console.log(result); });

var insertPost = function (post) {
  var defer = Q.defer();

  db.insertNode(post, 'Post', function (err, val) {
    if (err) {
      return defer.reject(err);
    }
    return defer.resolve(val);
  });

  return defer.promise;
};


var upsertTag = function (tag_name) {
  var defer = Q.defer(),
    tag = {name: tag_name};

  db.cypherQuery('MERGE(tag: Tag { name: {name} }) RETURN tag', tag,
    function (err, result) {
      if (err) { return defer.reject(err); }

      if (result.data.length > 1) {
        return defer.reject("Too many node founded, this shoudn't happend, something is going wrong");
      }

      return defer.resolve(result.data[0]);
    });

  return defer.promise;
};

var upsertTags = function (tags) {
  return asyncq.map(tags, upsertTag);
};

var createRelation = function (post) {
  return function (tag) {
    var defer = Q.defer();

    db.insertRelationship(post._id, tag._id, 'Tagged', {}, function (err, rel) {
      if (err) { return defer.reject(err); }

      return defer.resolve(rel);
    });

    return defer.promise;
  };
};

var insertData = function (data) {
  var postAndTags = {
    post: function () { return insertPost(data.post); },
    tags: function () { return upsertTags(data.tags); }
  };
  return asyncq.parallel(postAndTags);
};

var createRelations = function (postAndTags) {
  return asyncq.each(postAndTags.tags, createRelation(postAndTags.post));
};

var handleData = function (data) {
  return asyncq.waterfall([
    function () { return Q.when(data); },
    insertData,
    createRelations
  ]);
};

var handleDatas = function (datas) {
  return asyncq.each(datas, handleData);
};

var main = function () {
  handleDatas(datas)
    .then(
      function (result) {
        console.log(result);
      },
      function (err) {
        console.log(err);
      }
    );
};

main();

