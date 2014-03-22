
var plan = require('../')();
plan.set('maxCount', 10);

for (var i=0; i<20; i++) {
  plan('parallel', 'beep');
}

plan('parallel', function(data, next) {
  console.log(data);
  setTimeout(next, 3000);
});
