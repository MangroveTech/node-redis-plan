
var plan = require('../')();
plan.set('maxCount', 10);

for (var i=0; i<14; i++) {
  plan('parallel', 'beep'+i);
}

plan('parallel', function(data, next) {
  console.log(data);
  plan('success', data);
  setTimeout(next, 3000);

  if (data === 'beep5') {
    plan.close();
  }
});

plan('close', function() {
  console.log('gracefully quit');
});
