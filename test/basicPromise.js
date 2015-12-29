/**
 * Created by yunfei on 9/9/15.
 */
import test from 'unit.js';
import lib from './lib';
import Promise from '../src/Promise';

describe('Test Basic Promise', () => {
    it('Fulfilled Promise', (done) => {
        var p = new Promise((resolve) => {
            resolve('resolved');
        });

        p.then((value) => {
            setTimeout(() => {
                test.assert.equal(value, 'resolved');
                done();
            }, 0);
        }, () => {
            lib.failTest(done);
        });
    });

    it('Rejected Promise', (done) => {
        var p = new Promise((resolve, reject) => {
            reject('rejected');
        });

        p.then(() => {
            lib.failTest(done);
        }, (reason) => {
            setTimeout(() => {
                test.assert.equal(reason, 'rejected');
                done();
            }, 0);
        });
    });

    it('Rejected Promise (rejected by error)', (done) => {
        (new Promise(() => {
            throw new Error('by exception');
        })).then(() => {
            lib.failTest(done);
        }, (reason) => {
            setTimeout(() => {
                test.assert.equal(reason.message, 'by exception');
                done();
            }, 0);
        });
    });

    it('Fulfilled Promise with two "then" binding', (done) => {
        var p = new Promise((resolve) => {
                resolve('resolved');
            }),
            firstOutput;

        p.then((value) => {
            firstOutput = value;
        }, () => {
            lib.failTest(done);
        });

        p.then((value) => {
            setTimeout(() => {
                test.assert.equal(firstOutput, 'resolved');
                test.assert.equal(value, 'resolved');
                done();
            }, 0);
        }, () => {
            lib.failTest(done);
        });
    });

    it('Rejected Promise with two "then" binding', (done) => {
        var rejectedObj = {a: 1},
            p = new Promise((resolve, reject) => {
                reject(rejectedObj);
            }),
            firstOutput;

        p.then(() => {
            lib.failTest(done);
        }, (reason) => {
            firstOutput = reason;
        });

        p.then(() => {
            lib.failTest(done);
        }, (reason) => {
            setTimeout(() => {
                test.assert.equal(firstOutput, rejectedObj);
                test.assert.equal(reason, rejectedObj);
                done();
            }, 0);
        });
    });

    it('Async Rejected Promise', (done) => {
        var p = new Promise((resolve, reject) => {
            setTimeout(reject('rejected'), 50);
        });

        p.then(() => {
            lib.failTest(done);
        }, (reason) => {
            setTimeout(() => {
                test.assert.equal(reason, 'rejected');
                done();
            }, 0);
        });
    });
});
