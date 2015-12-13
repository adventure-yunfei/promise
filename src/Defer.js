/**
 * Created by yunfei on 12/9/15.
 */
const STATE_PENDING = 1;
const STATE_FULFILLED = 2;
const STATE_REJECTED = 3;

export default class Defer {
    state = STATE_PENDING;
    fulfilledHooks = [];
    rejectedHooks = [];
    output = null;

    constructor(fnResolver) {
        try {
            fnResolver((value) => {
                this.resolve(value);
            }, (reason) => {
                this.reject(reason);
            });
        } catch (e) {
            this.reject(e);
        }
    }

    resolve(value) {
        this.state = STATE_FULFILLED;
        this.output = value;
        this.fulfilledHooks.forEach((hook) => {
            hook(value);
        });
    }

    reject(reason) {
        this.state = STATE_REJECTED;
        this.output = reason;
        this.rejectedHooks.forEach((hook) => {
            hook(reason);
        });
    }

    getPromise() {
        if (!this._promise) {
            this._promise = {
                d: this,
                then: (onFulfilled, onRejected) => {
                    var defer = new Defer((resolve, reject) => {
                        var handleHook = (hook, deferHooks, targetDeferState) => {
                            var handlePromiseOutput = (output) => {
                                if (!hook) {
                                    (this.state === STATE_FULFILLED ? resolve : reject)(output);
                                    return;
                                }
                                var result;
                                try {
                                    result = hook(output);
                                } catch (e) {
                                    reject(e);
                                    return;
                                }
                                if (result === this._promise) {
                                    reject(new TypeError('get the same promise object on chain'));
                                } else if (result && typeof result.then === 'function') {
                                    result.then((value) => {
                                        resolve(value);
                                    }, (reason) => {
                                        reject(reason);
                                    });
                                } else {
                                    resolve(result);
                                }
                            };
                            if (this.state === STATE_PENDING) {
                                deferHooks.push((output) => {
                                    handlePromiseOutput(output);
                                });
                            } else if (this.state === targetDeferState) {
                                handlePromiseOutput(this.output);
                            }
                        };
                        handleHook(onFulfilled, this.fulfilledHooks, STATE_FULFILLED);
                        handleHook(onRejected, this.rejectedHooks, STATE_REJECTED);
                    });

                    return defer.getPromise();
                }
            };
        }
        return this._promise;
    }
}
