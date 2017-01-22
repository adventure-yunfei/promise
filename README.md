# Promise

Implementation of javascript [Promise/A+ standard](https://promisesaplus.com/), plus `.finally` and `onUnhandledRejection`.

Nothing more. Clean and tiny (4.5 KB Only).

Use it by: `npm install beauty-promise`, or include `browser-bundles/promise.min.js`.

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
