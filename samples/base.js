var Plan = require('../index.js')();

Plan.on('error', function (err, list, task) {
  console.log(err);
});

for (var i = 0; i < 5; i++) {
  Plan.enqueue('task', i);
}

Plan.dequeue('task', function (err, data, next) {
  setTimeout(function () {
    console.log(data);
    next();
  }, 1000);
});