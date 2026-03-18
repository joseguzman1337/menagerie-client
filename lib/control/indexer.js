var Collection = require('../model/collection');
var Path = require('path');

var Indexer = module.exports = function(collection, source, resource) {
  this.collection = Collection.of(collection);
  this.source = source;
  this.resource = resource;
};

Indexer.prototype.start = function(service, interval) {
  if (service) Collection.connect(service);
  this.interval = interval || 60;
  this.state = {};

  var indexer = this;
  var source = this.source;
  var collection = this.collection;
  var Resource = this.resource;

  function index() {
    source.list(function(err, resource) {
      if(err) return console.log(err.stack);
      source.metadata(resource, function(err, metadata) {
        if(err) return console.log(err.stack);

        collection.set(Resource.create(metadata, source), function(err) {
          if(err) return console.log(err.stack);
        });
      });
    });
  }

  this._scheduler = setInterval(index, this.interval * 1000);
  index();
};

Indexer.prototype.stop = function() {
  clearInterval(this._scheduler);
};

Indexer.prototype.restart = function(service) {
  this.stop();
  this.start(service);
};
