var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise;

describe('Test Basic Promise', () => {
    it('Resolver should be sync call', function (done) {
        var output = [];
        var promise = (new Promise((resolve, reject) => {
            output.push('sync push inside resolver');
            resolve('promise result');
            output.push('sync push inside resolver: after resolved');
        }));

        output.push('sync push outside resolver');
        promise.then(val => setTimeout(() => {
            output.push(val);
            assert.deepEqual(output, [
                'sync push inside resolver',
                'sync push inside resolver: after resolved',
                'sync push outside resolver',
                'sync push outside resolver: after then',
                'promise result'
            ]);
            done();
        }, 0));
        output.push('sync push outside resolver: after then');
    });

    it('Fulfilled Promise', (done) => {
        var p = new Promise((resolve) => {
            resolve('resolved');
        });

        p.then(val => setTimeout(() => {
            assert.equal(val, 'resolved');
            done();
        }, 0), lib.failBranch(done));
    });

    it('Fulfilled Promise with multiple resolve/reject', (done) => {
        // Resolved/Rejected promise won't change state again, and won't trigger callback duplicately
        var output = [];
        var onGetVal = addPrefix => val => {
            output.push(addPrefix + val);
            if (output.length === 2) {
                setTimeout(() => {
                    assert.deepEqual(output, ['first resolved', 'second resolved']);
                    done();
                }, 0);
            } else if (output.length > 2) {
                done('Unepxected extra callback');
            }
        };
        (new Promise((resolve, reject) => {
            resolve('resolved');
            resolve('resolved twice');
            reject('rejected');
            reject('rejected twice');
        })).then(onGetVal('first '), lib.failBranch(done));

        (new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve('resolved');
                resolve('resolved twice');
                reject('rejected');
                reject('rejected twice');
            }, 0);
        })).then(onGetVal('second '), lib.failBranch(done));
    });

    it('Rejected Promise', (done) => {
        var p = new Promise((resolve, reject) => {
            reject('rejected');
        });

        p.then(lib.failBranch(done), reason => setTimeout(() => {
            assert.equal(reason, 'rejected');
            done();
        }, 0));
    });

    it('Rejected Promise (rejected by error)', (done) => {
        (new Promise(() => {
            throw new Error('by exception');
        })).then(lib.failBranch(done), reason => setTimeout(() => {
            assert(reason instanceof Error);
            assert(reason.message, 'by exception');
            done();
        }, 0));
    });

    it('Fulfilled Promise with two "then" binding', (done) => {
        var output = [];
        var onGetVal = addPrefix => val => {
            output.push(addPrefix + val);
            if (output.length === 2) {
                setTimeout(() => {
                    assert.deepEqual(output, ['first resolved', 'second resolved']);
                    done();
                }, 0);
            } else if (output.length > 2) {
                done('Unepxected extra callback');
            }
        };
        var p = new Promise((resolve) => {
            resolve('resolved');
        });

        p.then(onGetVal('first '), lib.failBranch(done));

        p.then(onGetVal('second '), lib.failBranch(done));
    });

    it('Rejected Promise with two "then" binding', (done) => {
        var output = [],
            rejectedObj = {a: 1};
        var onGetObj = prefixItem => obj => {
            output.push(prefixItem, obj);
            if (output.length === 4) {
                setTimeout(() => {
                    assert.equal(output[0], 'first');
                    assert.equal(output[1], rejectedObj);
                    assert.equal(output[2], 'second');
                    assert.equal(output[3], rejectedObj);
                    done();
                }, 0);
            } else if (output.length > 4) {
                done('Unepxected extra callback');
            }
        };
        var p = new Promise((resolve, reject) => {
            reject(rejectedObj);
        });

        p.then(lib.failBranch(done), onGetObj('first'));

        p.then(lib.failBranch(done), onGetObj('second'));
    });

    it('Async Rejected Promise', (done) => {
        var p = new Promise((resolve, reject) => {
            setTimeout(() => reject('rejected'), 50);
        });

        p.then(lib.failBranch(done), reason => setTimeout(() => {
            assert.equal(reason, 'rejected');
            done();
        }, 0));
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
