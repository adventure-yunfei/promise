var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise,
    failBranch = lib.failBranch;

describe('Test Promise.all/race shortcut', () => {
    it('Promise.all with all resolved', (done) => {
        Promise.all([
            new Promise((resolve) => {
                setTimeout(() => resolve('resolved 1'), 0);
            }),
            new Promise((resolve) => {
                resolve('resolved 2');
            }),
            Promise.resolve('resolved 3'),
            {
                then: (onFulfilled) => {
                    setTimeout(() => onFulfilled('resolved 4'), 0);
                }
            }
        ]).then((values) => {
            setTimeout(() => {
                assert.deepEqual(values, [
                    'resolved 1',
                    'resolved 2',
                    'resolved 3',
                    'resolved 4'
                ]);
                done();
            }, 0);
        });
    });

    it('Promise.all with rejected', (done) => {
        Promise.all([
            new Promise((resolve) => {
                setTimeout(() => resolve('resolved 1'), 0);
            }),
            new Promise((resolve) => {
                resolve('resolved 2');
            }),
            Promise.reject('rejected 3'),
            {
                then: (onFulfilled) => {
                    setTimeout(() => onFulfilled('resolved 4'), 0);
                }
            }
        ]).then(failBranch(done), reason => setTimeout(() => {
            assert.equal(reason, 'rejected 3');
            done();
        }, 0));
    });

    it('Promise.race with rejected', (done) => {
        Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => reject('rejected 1'), 0);
            }),
            new Promise((resolve) => {
                setTimeout(() => resolve('resolved 2'), 0);
            }),
            {
                then: (onFulfilled, onRejected) => {
                    onRejected('rejected 4');
                }
            },
            Promise.reject('rejected 5')
        ]).then(failBranch(done), reason => {
            setTimeout(() => {
                assert.equal(reason, 'rejected 4');
                done();
            });
        });
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
