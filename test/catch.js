var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise,
    failBranch = lib.failBranch;

describe('Test Promise .catch shortcut', () => {
    it('Test catch for resolved promise', (done) => {
        (new Promise((resolve) => {
            resolve('resolved');
        })).catch(failBranch(done));
        done();
    });

    it('Test catch for rejected promise', (done) => {
        (new Promise((resolve, reject) => {
            reject('rejected');
        })).catch(reason => setTimeout(() => {
            assert.equal(reason, 'rejected');
            done();
        }, 0));
    });

    it('Test catch effecting promise state', (done) => {
        const output = [];
        (new Promise(() => {
            throw new Error('first rejected');
        }))
            .catch(reason => {
                output.push(reason && reason.message);
                return 'second resolved';
            })
            .then(value => {
                output.push(value);
                return 'third resolved';
            })
            .catch(failBranch(done))
            .then(value => {
                output.push(value);
                setTimeout(() => {
                    assert.deepEqual(output, [
                        'first rejected',
                        'second resolved',
                        'third resolved'
                    ]);
                    done();
                }, 0);
            });
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
