var Plan1 = require('../index.js')();
var Plan2 = require('../index.js')();


Plan1.on('error', function (err, list, task) {
  console.log(err);
});
Plan2.on('error', function (err, list, task) {
  console.log(err);
});


for (var i = 0; i < 5; i++) {
  Plan1.enqueue('task1', i);
}

for (var j = 0; j < 5; j++) {
  Plan2.enqueue('task2', j);
}

Plan1.dequeue('task1', function (err, data, next) {
  setTimeout(function (){
    console.log('task1: ' + data);
    next();
  }, 1000);
});

Plan2.dequeue('task2', function (err, data, next) {
  setTimeout(function (){
    console.log('task2: ' + data);
    next();
  }, 2000);
});