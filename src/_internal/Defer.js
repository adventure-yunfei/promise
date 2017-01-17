/**
 * Created by yunfei on 12/9/15.
 */
import __assert__ from './__assert__';
const STATE_PENDING = 1;
const STATE_FULFILLED = 2;
const STATE_REJECTED = 3;

export default class Defer {
    state = STATE_PENDING;
    fulfilledHooks = [];
    rejectedHooks = [];
    output = null;

    constructor(fnResolver) {
        __assert__(typeof fnResolver === 'function', 'Defer constructor only accepts a function as input');
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
        if (this.state !== STATE_PENDING) {
            return;
        }
        this.state = STATE_FULFILLED;
        this.output = value;
        this.fulfilledHooks.forEach((hook) => {
            hook(value);
        });
    }

    reject(reason) {
        if (this.state !== STATE_PENDING) {
            return;
        }
        this.state = STATE_REJECTED;
        this.output = reason;
        this.rejectedHooks.forEach((hook) => {
            hook(reason);
        });
    }

    then(onFulfilled, onRejected) {
        __assert__(!onFulfilled || typeof onFulfilled === 'function', 'Defer.then: onFulfilled must be a function');
        __assert__(!onRejected || typeof onRejected === 'function', 'Defer.then: onRejected must be a function');
        const {state, output, fulfilledHooks, rejectedHooks} = this;
        if (state === STATE_PENDING) {
            onFulfilled && fulfilledHooks.push(onFulfilled);
            onRejected && rejectedHooks.push(onRejected);
        } else {
            const hook = (state === STATE_FULFILLED ? onFulfilled : onRejected);
            hook && hook(output);
        }
    }
}
