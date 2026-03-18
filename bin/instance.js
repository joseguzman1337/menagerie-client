var Config = require('nconf');
var Path = require('path');

var Beacon = require('../lib/control/beacon');
var Resource = require('../lib/model/resource');

Config.file(Path.resolve(__dirname, '../conf/instance.json'));
Config.defaults({
  collection: 'instances',
  service:{
    hostname: 'localhost',
    port: 2381
  },
  interval: 5,
  ttl: 10,
  resource: {
    name: 'nothing',
    version: '0.0.0'
  }
});

var resource = Resource.create(Config.get('resource'), {
  ttl: Config.get('ttl'),
  multiple: true
});

(new Beacon(Config.get('collection'), resource))
  .start(Config.get('service'), Config.get('interval'));
