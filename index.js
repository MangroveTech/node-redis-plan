
var redis = require('redis');
var EventEmitter = require('events').EventEmitter;
var planKeys = require('./plan-keys.json');
var defaultOpt = require('./option.json');

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
    emit.call(self, 'plan:'+name, data);
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
  var option = self.option;
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
    
    var val;
    try {
      val = JSON.parse(replies[1]);
    } catch (e) {
      val = replies[1];
    }

    pre();
    cb(val, next);
    check();
  }

  function pre() {
    self.workerCount++;
  }

  function check() {
    if (!self._ref) {
      if (self.workerCount === 0) {
        self.conn.end();
        self.emitter.emit('close');
      }
      return;
    }
    if (self.workerCount < option.maxCount || !option.maxCount) {
      self.conn.blpop(name, 0, popcb);
    }
  }

  function next(err) {
    self.workerCount--;
    check();
  }
}

module.exports = function(port, host, option) {
  var env = {};
  env._ref = true;
  env.conn = redis.createClient.apply(this, arguments);
  env.port = port;
  env.host = host;
  env.option = option || defaultOpt;
  env.emitter = new EventEmitter();
  env.workerCount = 0;
  env.conn.on('error', function(err) {
    emit.call(env, 'error', err);
  });

  var ret = plan.bind(env);
  ret.close = function() {
    env._ref = false;
    env.conn.unref();
    return ret;
  };
  ret.set = function(name, value) {
    env.option[name] = value;
    return ret;
  };

  return ret;
};