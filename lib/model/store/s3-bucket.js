var AWS = require('aws-sdk');
var Path = require('path');

var METADATA_JSON = 'metadata.json';

var S3Bucket = module.exports = function(options) {
  options = options || {};

  this.prefix = options.prefix;
  this.bucket = options.bucket;

  this.client = new AWS.S3({
    region: options.region,
    credentials: options.credentials,
  });
};

S3Bucket.prototype.list = function(callback) {
  this.client.listObjects({
    Bucket: this.bucket,
    Prefix: this.prefix
  }, function(err, data) {
    if (err) return callback(err);

    var resources = [];
    data.Contents.forEach(function(node) {
      if (Path.basename(node.Key) != METADATA_JSON) return;

      var path = Path.dirname(node.Key)
      var version = Path.basename(path);
      path = Path.dirname(node.Key);
      var name = Path.basename(path);


      resources.push({
        name: name,
        version: version,
        etag: node.ETag.replace(/"/g, '')
      });
    });

    callback(null, resources);
  });
};

S3Bucket.prototype.metadata = function(resource, version, callback) {

};

S3Bucket.prototype.artifact = function(resource, version, name, callback) {

};
