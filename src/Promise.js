import __assert__ from 'js-assert/__assert__';
import Defer from './Defer';

export default class Promise {
    static resolve = (value) => new Promise((resolve) => {
        resolve(value);
    });
    static reject = (reason) => new Promise((resolve, reject) => {
        reject(reason);
    });

    static all = (promises) => {
        __assert__(Array.isArray(promises), 'Promise.all only accepts an array as input');
        __assert__(promises.every((p) => typeof p.then === 'function'), 'Promise.all only accepts an array of thenable object(promise) as input');
        return new Promise((resolve, reject) => {
            const resolvedValues = [];
            let leftResolvedCnt = promises.length;
            let finished = false;
            promises.forEach((p, idx) => {
                p.then((value) => {
                    if (!finished) {
                        resolvedValues[idx] = value;
                        leftResolvedCnt--;
                        if (leftResolvedCnt === 0) {
                            resolve(resolvedValues);
                            finished = true;
                        }
                    }
                }, () => {
                    if (!finished) {
                        reject();
                        finished = true;
                    }
                });
            });
        });
    };

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
    };

    constructor(fnResolver) {
        __assert__(typeof fnResolver === 'function', 'Promise constructor only accepts a function as input');
        let stateHasPropagated = false;
        const defer = new Defer(fnResolver);
        defer.then(null, (reason) => {
            setTimeout(() => {
                if (!stateHasPropagated) {
                    throw new Error(`Unhandled promise rejection: ${reason}`);
                }
            }, 1);
        });

        this.then = (onFulfilled = null, onRejected = null) => {
            __assert__(!onFulfilled || typeof onFulfilled === 'function', 'Promise.then: onFulfilled must be a function');
            __assert__(!onRejected || typeof onRejected === 'function', 'Promise.then: onRejected must be a function');
            stateHasPropagated = true;
            return new Promise((resolve, reject) => {
                var handleDeferOutput = (hook, output, defaultHandler) => {
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
                        result.then((value) => {
                            resolve(value);
                        }, (reason) => {
                            reject(reason);
                        });
                    } else {
                        resolve(result);
                    }
                };

                defer.then((value) => {
                    handleDeferOutput(onFulfilled, value, resolve);
                }, (reason) => {
                    handleDeferOutput(onRejected, reason, reject);
                });
            });
        };

        this.finally = (onFinally) => {
            __assert__(typeof onFinally === 'function', 'Promise.finally: onFinally must be a function');
            defer.then(onFinally, onFinally);
            return this.then();
        };
    }

    catch = (onRejected) => {
        __assert__(typeof onRejected === 'function', 'Promise.catch: onRejected must be a function');
        return this.then(null, onRejected);
    };
}

if (typeof window !== 'undefined') {
    /* global window */
    window.Promise = Promise;
}
