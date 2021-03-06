
var test = require('tape');
var plan = require('../index')();
plan('error', function(err) {
  console.error(err);
});

test('emitter array', function(t) {
  var excepted = {
    foo: 10,
    beep: 20
  };
  plan('success', function(sent) {
    t.equal(sent, excepted);
    t.end();
  });
  plan('test2', excepted);
  plan('test2', function(data, next) {
    t.deepEqual(data, excepted);
    plan.close();
  });
});

