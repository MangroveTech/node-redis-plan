
var test = require('tape');
var plan = require('../index')();
plan('error', function(err) {
  console.error(err);
});

test('emitter string', function(t) {
  var excepted = 'beep';
  plan('success', function(sent) {
    t.equal(sent, excepted);
    t.end();
  });
  plan('test1', excepted);
  plan('test1', function(data, next) {
    t.equal(data, excepted);
    plan.end();
  });
});


