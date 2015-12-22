import Defer from './Defer';

export default class Promise {
    static resolve = (value) => new Promise((resolve) => {
        resolve(value);
    });
    static reject = (reason) => new Promise((resolve, reject) => {
        reject(reason);
    });

    static all = (promises) => {
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
                })
            });
        });
    };

    static race = (promises) => {
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
            defer.then(onFinally, onFinally);
            return this.then();
        };
    }

    catch = (onRejected) => this.then(null, onRejected);
}

if (typeof window !== 'undefined') {
    window.Promise = Promise;
}