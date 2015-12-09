var Defer = require('./Defer');

function Promise(fnResolver) {
    var deferred = new Defer(fnResolver);
    return deferred.getPromise();
}

module.exports = Promise;