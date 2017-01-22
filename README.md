# Promise

Implementation of javascript [Promise/A+ standard](https://promisesaplus.com/), plus `.finally` and `onUnhandledRejection`.

Nothing more. Clean and tiny (3.9 KB Only, or 1.4 KB gzipped).

Use it by: `npm install beauty-promise`, or include `browser-bundles/promise.min.js`.

- Why not [`bluebird`](https://github.com/petkaantonov/bluebird/)? -- Too large
- Why not [babel (core-js) runtime)](https://github.com/zloirock/core-js/blob/master/es6/promise.js) -- Too large (and simple)
- Why not [`q`](https://github.com/kriskowal/q) -- Still too large
- Why not [`then@promise`](https://github.com/then/promise) -- Well, it's not quite large (although still larger than this one). But I don't feel good for its implementation of 'unhandled rejection tracking' - complex api, and the trigger is delayed.

What I want is a basic and tiny Promise, with useful 'unhandled rejection tracking' (which is only supported on Chrome for native Promise). So I created this one.

# Promise API

##### Constructor

```javascript
new Promise(fn: function(resolve, reject))
```

##### Promise Instance Methods

```javascript
promise.then(onFulfilled: null|function(value), onRejected: null|function(reason))
```

```javascript
promise.catch(onRejected: function(reason))
```

```javascript
promise.finally(onRejected: function(valueOrReason))
```

##### Static Methods

```javascript
Promise.resolve(value: *)
```

```javascript
Promise.reject(reason: *)
```

```javascript
Promise.all(promises: Array.<Promise | Thenable>)
```

```javascript
Promise.race(promises: Array.<Promise | Thenable>)
```

##### Unhandled Promise Rejection

```javascript
Promise.onUnhandledRejection = function (reason) {
    // ... handle your unhandled rejection
};
```
