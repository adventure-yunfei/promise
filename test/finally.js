var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise,
    failBranch = lib.failBranch,
    expectedUncaughtException = lib.expectedUncaughtException;

describe('Test Promise .finally', () => {
    it('Test finally for resolved promise', (done) => {
        const output = [];
        (new Promise((resolve) => {
            resolve('resolved');
        }))
            .finally(arg => output.push('finally', arg))
            .then(value => {
                output.push(value);
                setTimeout(() => {
                    assert.deepStrictEqual(output, ['finally', undefined, 'resolved']);
                    done();
                }, 0);
            });
    });

    it('Test finally for rejected promise', (done) => {
        const output = [];
        (new Promise((resolve, reject) => {
            reject('rejected');
        }))
            .finally(arg => output.push('finally', arg))
            .then(null, reason => {
                output.push(reason);
                setTimeout(() => {
                    assert.deepStrictEqual(output, ['finally', undefined, 'rejected']);
                    done();
                }, 0);
            });
    });

    it('finally with exception', function (done) {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 2) {
                    setTimeout(() => {
                        assert.deepEqual(output.sort(), [
                            'got finally exception',
                            'resolved'
                        ].sort());
                        done();
                    }, 0);
                } else if (output.length > 2) {
                    done('Unepxected extra callback');
                }
            };
        (new Promise((resolve, reject) => {
            resolve('resolved');
        }))
            .finally(() => {
                expectedUncaughtException(error => error instanceof Error && error.message === 'test a finally exception', () => onGetVal('got finally exception'));
                throw new Error('test a finally exception');
            })
            .then(onGetVal, failBranch(done));
    });

    it('Test multiple finally calls (include "catch" usage)', (done) => {
        const output = [];
        (new Promise(() => {
            throw new Error('first rejected');
        }))
            .finally(() => output.push('finally'))
            .catch(reason => {
                output.push(reason instanceof Error, reason && reason.message);
                return 'second resolved';
            }).finally(arg => {
                output.push('finally', arg);
                return '__fail__';
            }).finally(arg => {
                output.push('finally', arg);
                return '__fail__';
            }).then(value => {
                output.push(value);
                setTimeout(() => {
                    assert.deepStrictEqual(output, [
                        'finally',
                        true, 'first rejected',
                        'finally', undefined,
                        'finally', undefined,
                        'second resolved'
                    ]);
                    done();
                }, 0);
            });
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
