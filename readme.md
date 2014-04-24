
redis-plan
================

Message queue based on redis for NodeJS and Mangrove internal usage.

[![Build Status](https://travis-ci.org/MangroveTech/node-redis-plan.svg)](https://travis-ci.org/MangroveTech/node-redis-plan)

[![NPM](https://nodei.co/npm/redis-plan.png?stars&downloads)](https://nodei.co/npm/redis-plan/) [![NPM](https://nodei.co/npm-dl/redis-plan.png)](https://nodei.co/npm/redis-plan/)

### Installation
```sh
$ npm install redis-plan
```

### Usage

initialization
```js
var plan = require('redis-plan')(port, host, option);
```

for queueing
```js
plan('your queue name in redis', 'your data to transfer to worker');
```

worker just like this simplely
```js
plan('your queue name in redis', function(data, next) {
  // u could start handle `data` from queue
  next();
});
```

In the end, remeber that calling `plan.end()` to close the connection to redis.

### Parallel Worker
```js
var plan = require('../')();
plan.set('maxCount', 100);
plan('parallel', function(data, next) {
  console.log(data);
  setTimeout(next, 3000);
});
```

### Parallel Queueing
```js
var plan = require('../')();
// just a simple for loop
for (var i=0; i<10; i++) {
  plan('parallel', data);
}
```

### Async Feedback
```js
plan('async-feedback', function(item, next) {
  asyncMethod(item, function(err) {
    next();
    if (err) 
      plan('error', err.stack);
    else
      plan('success', item);
  });
});
```
NB: `success`, `close` and `error` is especial keys, which you could use to report
data to redis and local event `success` and `error`, and in redis you are able
to access these reports at `plan:success`, `plan:close` and `plan:error`.

### Gracefully Quit
```js
process.on('exit', function() {
  plan.close();
});

```

### License
MIT
