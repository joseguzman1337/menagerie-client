var Config = require('nconf');
var Path = require('path');

var Indexer = require('../lib/control/indexer');

var Cookbook = require('../lib/model/resource/cookbook');
var S3Bucket = require('../lib/model/source/s3-bucket');

Config.file(Path.resolve(__dirname, '../conf/cokbooks.json'));
Config.defaults({
  service:{
    hostname: 'localhost',
    port: 2381
  },
  collection: 'cookbooks',
  source: {
    region: 'us-east-1',
    bucket: 'cookbooks.manero.io',
    prefix: 'cookbooks'
  }
});

(new Indexer(
  Config.get('collection'),
  new S3Bucket(Config.get('source')),
  Cookbook)).start(Config.get('service'));
