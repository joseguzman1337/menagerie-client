var HTTP = require('http');
var Path = require('path');
var QS = require('qs');
var URL = require('url');

var Client = module.exports = function(uri) {
  var agent = this.agent = new HTTP.Agent({
    keepAlive: true,
    keepAliveMsecs: 5000
  });
  if (typeof uri === 'string') uri = URL.parse(uri);

  this.remote = {
    hostname: uri.hostname || uri.host || 'localhost',
    port: +(uri.port) || 2381,
    headers: {
      accept: 'application/json'
    },
    query: {}
  };
};

/**
 * Recursivly merge default client parameters with call options
 * @private
 */
function merge(defaults, options) {
  options = options instanceof Object ? options : {};

  Object.keys(defaults).forEach(function(key) {
    if (defaults[key] instanceof Object) {
      options[key] = merge(defaults[key], options[key]);
    }
    if (!options[key]) options[key] = defaults[key];
  });

  return options;
}

Client.prototype.connect = function(options) {
  this.remote = merge(this.remote, options || {});
};

Client.prototype.raw = function(method, path, body, options, callback) {
  options = options || {};
  if (options instanceof Function) {
    callback = options;
    options = {};
  }

  var params = merge(this.remote, {
    hostname: options.hostname || options.host,
    port: options.port,
    method: method,
    path: path + '?' + QS.stringify(options.query),
    headers: options.headers,
    query: options.query
  });
  params.agent = this.agent;

  // Render JSON
  if (!!body && body instanceof Object) try {
    body = new Buffer(JSON.stringify(body), 'utf8');
    params.headers['content-type'] = 'application/json';
    params.headers['content-length'] = body.length;
  } catch (e) {
    return callback(e);
  }

  var req = HTTP.request(params);

  req.on('error', callback);
  req.on('response', function(res) {
    var data = '';
    res.setEncoding('utf8');
    res.on('data', function(d) {
      data += d;
    });

    res.on('end', function(d) {
      if (d) data += d;
      res.data = data;

      // Parse JSON
      try {
        var body = JSON.parse(data);
        callback(null, body, req, res);
      } catch (e) {
        return callback(e, null, req, res);
      }
    });
  });

  // Send it
  if (body) req.write(body);
  req.end();
};

Client.prototype.get = function(path, options, callback) {
  this.raw('GET', path, null, options, callback);
};

Client.prototype.put = function(path, body, options, callback) {
  this.raw('PUT', path, body, options, callback);
};

Client.prototype.post = function(path, body, options, callback) {
  this.raw('POST', path, body, options, callback);
};

Client.prototype.del = function(path, options, callback) {
  this.raw('DELETE', path, null, options, callback);
};
