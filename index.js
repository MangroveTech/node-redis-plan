var redis = require('redis');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Plan(port, host, options) {
  EventEmitter.call(this);

  if (!(this instanceof Plan)) {
    return new Plan;
  }

  this.conn = redis.createClient.apply(this, arguments);
}

util.inherits(Plan, EventEmitter);

Plan.prototype.enqueue = function enqueue(list, task, callback) {
  var self = this;
  if (arguments.length < 2) {
    self.emit('error', new Error('Arguments error!'));
    if (callback) callback(new Error('Arguments error!'));
    return;
  }
  self.conn.rpush(list, JSON.stringify(task), function (err, len) {
    if (err) {
      self.emit('error', err, list, task);
      if (callback) callback(err, len);
      return;
    }
    if (callback) callback(err, len);
    return;
  });
}

Plan.prototype.dequeue = function dequeue(list, callback) {
  var self = this;
  if (arguments.length < 2) {
    self.emit('error', new Error('Arguments error!'));
    if (callback) callback(new Error('Arguments error!'));
    return;
  }
  self.conn.blpop(list, 0, function (err, replies) {
    if (err) {
      self.emit('error', err, list);
      if (callback) callback(err, list);
      return;
    }
    return callback(err, JSON.parse(replies[1]), function next () {
      self.dequeue(list, callback);
    });
  });
}

Plan.prototype.close = function close() {
  this.conn.end();
  this.emit('close');
}

module.exports = Plan;