
redis-plan
================

Message queue based on redis for NodeJS and Mangrove internal usage.

[![Build Status](https://travis-ci.org/MangroveTech/node-redis-plan.svg)](https://travis-ci.org/MangroveTech/node-redis-plan)

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

### TODO

multi-channels support

### License
ZLIB
