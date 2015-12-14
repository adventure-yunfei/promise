import Defer from './Defer';

export default class Promise {
    constructor(fnResolver) {
        const defer = new Defer(fnResolver);

        this.then = (onFulfilled = null, onRejected = null) => {
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
    }

    catch = (onRejected) => this.then(null, onRejected);

    finally = (onFinally) => {
        this.then(onFinally, onFinally);
        return this.then();
    };
}