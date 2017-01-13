# Promise

Implementation of javascript Promise/A+ standard.

Utils to turn things to promise.

`npm install all-promise`

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

# Promise Translate Utils API

###### `callback_to_promise(func, options?)`: Turn function using callback to function returning promise.

API:
```javascript
// @param func: any func that receives callback as last argument and calling callback with error as first argument)
// @param [options]: options.resolvedAsArray (default false) means whether to resolve callback data as array. If false, only the first data is received
callback_to_promise(func, options?)
```

Examples:
```javascript
////// Before transforming
func(a, b, c, function (error, data) { ... });
/*nodejs*/ child_process.exec('ls', function (error, stdout, stdin) { ... });

////// After transforming
callback_to_promise(func)(a, b, c)
    .then(function (data) { ... })
    .catch(function (error) { ... });
/*nodejs*/ callback_to_promise(child_process.exec, {resolvedAsArray: true})('ls')
    .then(function (dataArray) {
        var stdout = dataArray[0];
        var stdin = dataArray[1];
        ...
    })
    .catch(function (error) { ... });
```

