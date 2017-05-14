const STATE_PENDING = 0;
const STATE_FULFILLED = 1;
const STATE_REJECTED = -1;

function __assert__(condition, errMsg = '') {
    if (!condition) {
        throw new Error(errMsg || '__assert__ failed. ');
    }
}

class InnerState {
    state = STATE_PENDING
    fulfilledHooks = []
    rejectedHooks = []
    propagated = false
    output = null

    constructor(fnResolver) {
        __assert__(typeof fnResolver === 'function', 'InnerState constructor only accepts a function as input');
        try {
            fnResolver((value) => {
                this.finish(STATE_FULFILLED, value);
            }, (reason) => {
                this.finish(STATE_REJECTED, reason);
            });
        } catch (e) {
            this.finish(STATE_REJECTED, e);
        }
    }

    finish(state, output) {
        if (this.state !== STATE_PENDING) {
            return;
        }
        if (state === STATE_FULFILLED && output && typeof output.then === 'function') {
            output.then(
                value => this.finish(STATE_FULFILLED, value),
                reason => this.finish(STATE_REJECTED, reason)
            );
            return;
        }
        this.state = state;
        this.output = output;
        setTimeout(() => {
            (state === STATE_FULFILLED ? this.fulfilledHooks : this.rejectedHooks).forEach(hook => {
                hook(output);
            });
            this.fulfilledHooks = [];
            this.rejectedHooks = [];
        }, 0);
    }

    onFinish(onFulfilled, onRejected) {
        __assert__(!onFulfilled || typeof onFulfilled === 'function', 'InnerState.onFinish: onFulfilled must be a function');
        __assert__(!onRejected || typeof onRejected === 'function', 'InnerState.onFinish: onRejected must be a function');
        const {state, output, fulfilledHooks, rejectedHooks} = this;
        if (state === STATE_PENDING) {
            onFulfilled && fulfilledHooks.push(onFulfilled);
            onRejected && rejectedHooks.push(onRejected);
        } else {
            const hook = (state === STATE_FULFILLED ? onFulfilled : onRejected);
            hook && setTimeout(() => hook(output), 0);
        }
    }
}

const KEY_INNNER_STATE = '_s';
const KEY_STATE_HAS_PROPOGATED = '_p';
class Promise {
    static resolve = (value) => new Promise((resolve, reject) => {
        const resolveValue = value => {
            if (value && typeof value.then === 'function') {
                value.then(resolveValue, reject);
            } else {
                resolve(value);
            }
        };
        resolveValue(value);
    })
    static reject = (reason) => new Promise((resolve, reject) => {
        reject(reason);
    })

    static all = (promises) => {
        __assert__(Array.isArray(promises), 'Promise.all only accepts an array as input');
        __assert__(promises.every((p) => typeof p.then === 'function'), 'Promise.all only accepts an array of thenable object(promise) as input');
        return new Promise((resolve, reject) => {
            const resolvedValues = [];
            let leftResolvedCnt = promises.length;
            let finished = false;
            promises.forEach((p, idx) => {
                p.then(value => {
                    if (!finished) {
                        resolvedValues[idx] = value;
                        leftResolvedCnt--;
                        if (leftResolvedCnt === 0) {
                            resolve(resolvedValues);
                            finished = true;
                        }
                    }
                }, reason => {
                    if (!finished) {
                        reject(reason);
                        finished = true;
                    }
                });
            });
        });
    }

    static race = (promises) => {
        __assert__(Array.isArray(promises), 'Promise.race only accepts an array as input');
        __assert__(promises.every((p) => typeof p.then === 'function'), 'Promise.race only accepts an array of thenable object(promise) as input');
        let finished = false;
        const getHandler = (fnFinish) => (promiseOutput) => {
            if (!finished) {
                fnFinish(promiseOutput);
                finished = true;
            }
        };
        return new Promise((resolve, reject) => {
            promises.forEach((p) => {
                p.then(getHandler(resolve), getHandler(reject));
            });
        });
    }

    static onUnhandledRejection = (reason) => {
        throw new Error(`Unhandled promise rejection: ${reason}`);
    }

    constructor(fnResolver) {
        __assert__(typeof fnResolver === 'function', 'Promise constructor only accepts a function as input');
        this[KEY_INNNER_STATE] = new InnerState(fnResolver);
        this[KEY_STATE_HAS_PROPOGATED] = false;
        this[KEY_INNNER_STATE].onFinish(null, (reason) => {
            setTimeout(() => {
                if (!this[KEY_STATE_HAS_PROPOGATED]) {
                    Promise.onUnhandledRejection(reason);
                }
            }, 0);
        });
    }

    then(onFulfilled = null, onRejected = null) {
        __assert__(!onFulfilled || typeof onFulfilled === 'function', 'Promise.then: onFulfilled must be a function');
        __assert__(!onRejected || typeof onRejected === 'function', 'Promise.then: onRejected must be a function');
        this[KEY_STATE_HAS_PROPOGATED] = true;
        return new Promise((resolve, reject) => {
            var handleFinish = (hook, output, defaultHandler) => {
                if (!hook) {
                    defaultHandler(output);
                    return;
                }
                var result;
                try {
                    result = hook(output);
                } catch (e) {
                    reject(e);
                    return;
                }
                if (result === this) {
                    reject(new TypeError('get the same promise object on chain'));
                } else if (result && typeof result.then === 'function') {
                    result.then(resolve, reject);
                } else {
                    resolve(result);
                }
            };

            this[KEY_INNNER_STATE].onFinish((value) => {
                handleFinish(onFulfilled, value, resolve);
            }, (reason) => {
                handleFinish(onRejected, reason, reject);
            });
        });
    }

    catch(onRejected) {
        __assert__(typeof onRejected === 'function', 'Promise.catch: onRejected must be a function');
        return this.then(null, onRejected);
    }

    finally(onFinally) {
        __assert__(typeof onFinally === 'function', 'Promise.finally: onFinally must be a function');
        const onFinallyWapper = () => onFinally();
        this[KEY_INNNER_STATE].onFinish(onFinallyWapper, onFinallyWapper);
        return this.then();
    }
}

module.exports = Promise;
