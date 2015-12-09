var STATE_PENDING = 1,
    STATE_FULFILLED = 2,
    STATE_REJECTED = 3;

function Defer(fnResolver) {
    var _this = this;
    this.state = STATE_PENDING;
    this.fulfilledHooks = [];
    this.rejectedHooks = [];
    this.output = null;

    try {
        fnResolver(function resolveHook(value) {
            _this.resolve(value);
        }, function rejectHook(reason) {
            _this.reject(reason);
        });
    } catch (e) {
        this.reject(e);
    }
}

Defer.prototype.resolve = function resolve(value) {
    this.state = STATE_FULFILLED;
    this.output = value;
    this.fulfilledHooks.forEach(function (hook) {
        hook(value);
    });
};

Defer.prototype.reject = function reject(reason) {
    this.state = STATE_REJECTED;
    this.output = reason;
    this.rejectedHooks.forEach(function (hook) {
        hook(reason);
    });
};

Defer.prototype.getPromise = function getPromise() {
    if (!this._promise) {
        var _this = this;
        this._promise = {
            _this: _this, // TODO: for debug
            then: function then(onFulfilled, onRejected) {
                var defer = new Defer(function (resolve, reject) {
                    var handleHook = function (hook, deferHooks, targetDeferState) {
                        if (hook) {
                            var handlePromiseOutput = function (output) {
                                var result;
                                try {
                                    result = hook(output);
                                } catch (e) {
                                    reject(e);
                                    return;
                                }
                                if (result === _this._promise) {
                                    reject(new TypeError('get the same promise object on chain'));
                                } else if (result && typeof result.then === 'function') {
                                    result.then(function (value) {
                                        resolve(value);
                                    }, function (reason) {
                                        reject(reason);
                                    });
                                } else {
                                    resolve(result);
                                }
                            };
                            if (_this.state === STATE_PENDING) {
                                deferHooks.push(function (output) {
                                    handlePromiseOutput(output);
                                });
                            } else if (_this.state === targetDeferState) {
                                handlePromiseOutput(_this.output);
                            }
                        }
                    };
                    handleHook(onFulfilled, _this.fulfilledHooks, STATE_FULFILLED);
                    handleHook(onRejected, _this.rejectedHooks, STATE_REJECTED);
                });

                return defer.getPromise();
            }
        };
    }
    return this._promise;
};

function Promise(fnResolver) {
    var deferred = new Defer(fnResolver);
    return deferred.getPromise();
}

if (typeof module !== 'undefined') {
    module.exports = Promise;
}