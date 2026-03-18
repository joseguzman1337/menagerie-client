var Path = require('path');
var Resource = require('../resource');
var URL = require('url');
var Util = require('util');

var Cookbook = module.exports = function(source) {
  Resource.call(this);

  // `opscode` is the alias for `supermarket`. A bunch of versions
  // of the berkshelf CLI don't seem to support `supermarket` ಠ_ಠ
  this.location_type = 'opscode';
  this.location_path = URL.format({
    protocol: 'http',
    hostname: source.hostname,
    pathname: source.path
  });

  this._default('priority', 0);
  this._default('dependencies', {});
  this._default('platforms', {});

  this.download_url = URL.format({
    protocol: 'http',
    hostname: source.hostname,
    pathname: Path.join(source.path, this.name, this.version, 'cookbook.tgz')
  });
};
Util.inherits(Cookbook, Resource);

Cookbook.create = function(resource, source) {
  resource.__proto__ = Cookbook.prototype; // jshint ignore:line
  Cookbook.call(resource, source);

  return resource;
};
