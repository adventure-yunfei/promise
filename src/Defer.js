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

    then(onFulfilled, onRejected) {
        const {state, output, fulfilledHooks, rejectedHooks} = this;
        if (state === STATE_PENDING) {
            onFulfilled && fulfilledHooks.push(onFulfilled);
            onRejected && rejectedHooks.push(onRejected);
        } else {
            (state === STATE_FULFILLED ? onFulfilled : onRejected)(output);
        }
    }
}
