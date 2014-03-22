
var plan = require('../')();
plan.set('maxCount', 10);

for (var i=0; i<5; i++) {
  plan('parallel', 'beep');
}

plan('parallel', function(data, next) {
  console.log(data);
  plan('success', data);
  setTimeout(next, 3000);
});
