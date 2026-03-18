var Collection = require('../model/collection');
var Path = require('path');

var Beacon = module.exports = function(collection, resource) {
  this.collection = Collection.of(collection);
  this.resource = resource;
  this.interval = 5;
};

Beacon.prototype.start = function(service, interval) {
  if (service) Collection.connect(service);
  if (interval) this.interval = interval;

  var beacon = this;
  function announce() {
    beacon.collection.set(beacon.resource, function(err) {
      if (err) console.log(err.stack);
    });
  }

  this._scheduler = setInterval(announce, this.interval * 1000);
  announce();
};

Beacon.prototype.stop = function() {
  clearInterval(this._scheduler);
};

Beacon.prototype.restart = function(service) {
  this.stop();
  this.start(service);
};
