var AWS = require('aws-sdk');
var Path = require('path');

var METADATA = 'metadata.json';

var S3Bucket = module.exports = function(options) {
  options = options || {};

  this.path = options.prefix;
  this.hostname = options.bucket;

  this.client = new AWS.S3({
    region: options.region,
    credentials: options.credentials,
  });
};

S3Bucket.prototype.list = function(callback) {
  this.client.listObjects({
    Bucket: this.hostname,
    Prefix: this.path
  }, function(err, data) {
    if (err) return callback(err);

    data.Contents.forEach(function(node) {
      if (Path.basename(node.Key) != METADATA) return;

      var path = Path.dirname(node.Key);
      var version = Path.basename(path);
      path = Path.dirname(path);
      var name = Path.basename(path);

      callback(null, {
        name: name,
        version: version,
        etag: node.ETag.replace(/"/g, '')
      });
    });
  });
};

S3Bucket.prototype.metadata = function(resource, callback) {
  this.client.getObject({
    Bucket: this.hostname,
    Key: Path.join(this.path, resource.name, resource.version, METADATA)
  }, function(err, data) {
    if (err) return callback(err);
    try {
      callback(null, JSON.parse(data.Body));
    } catch (e) {
      return callback(e);
    }
  });
};
