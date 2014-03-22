
var redis = require('redis');
var EventEmitter = require('events').EventEmitter;
var planKeys = require('./plan-keys.json');

function plan(key, value) {
  if (arguments.length !== 2) {
    emit('error', new Error('arguments error'));
  }
  switch (typeof value) {
    case 'function':
      on.call(this, key, value);
      break;
    default:
      emit.call(this, key, value);
      break;
  }
  return plan.bind(this);
}

function emit(name, data) {
  var self = this;
  if (planKeys.indexOf(name) !== -1) {
    return this.emitter.emit(name, data);
  }
  this.conn.rpush(name, JSON.stringify(data), function(err) {
    if (err)
      self.emitter.emit('error', err);
    else
      self.emitter.emit('success', data);
  });
}

function on(name, cb) {
  var self = this;
  if (planKeys.indexOf(name) !== -1) {
    return this.emitter.on(name, cb);
  }
  this.conn.blpop(name, 0, popcb);

  function popcb(err, replies) {
    if (err) {
      return self.emitter.emit('error', err);
    }
    var key = replies[0];
    if (key !== name) {
      return self.emitter.emit('error', 'name confict');
    }
    cb(JSON.parse(replies[1]), next);
  }

  function next(err) {
    if (err) {
      self.emitter.emit('error', err);
    }
    self.conn.blpop(name, 0, popcb);
  }
}

module.exports = function(port, host, option) {
  var env = {};
  env.conn = redis.createClient.apply(this, arguments);
  env.port = port;
  env.host = host;
  env.option = option || {};
  env.emitter = new EventEmitter();
  env.conn.on('error', function(err) {
    emit.call(env, 'error', err);
  });

  var ret = plan.bind(env);
  ret.end = function() {
    env.conn.end();
  };
  return ret;
};