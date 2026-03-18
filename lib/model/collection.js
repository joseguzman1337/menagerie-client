var Client = require('../client');
var Path = require('path');

var Collection = module.exports = function(name) {
  this.name = name;
};

Collection.of = function(name) {
  return new Collection(name);
};

Collection.connect = function(service) {
  Collection.client = new Client(service);
};

/**
 * List resources in the collection
 *
 * @callback(Error, Object) A hash of `{resource{version[instance]}}`
 */
Collection.prototype.list = function(callback) {
  Collection.client.get(Path.join('/collections', this.name), callback);
};

/**
 * Get resource@version from the collection
 */
Collection.prototype.get = function(name, version, callback) {
  var collection = this;
  var path = ['/collections', this.name, name];

  if (version instanceof Function) callback = version;
  else path.push(version);

  Collection.client.get(Path.join.apply(Path, path), callback);
};

/**
 * Add a resource to a version-set
 */
Collection.prototype.set = function(resource, callback) {
  Collection.client.put(Path.join('/collections', this.name), resource, {
    query: {
      ttl: resource._ttl,
      multiple: resource._multiple
    }
  }, callback);
};

Collection.prototype.del = function(name, version, callback) {
  var collection = this;
  var path = ['/collections', this.name, name];

  if (version instanceof Function) callback = version;
  else path.push(version);

  Collection.client.del(Path.join.apply(Path, path), callback);
};
