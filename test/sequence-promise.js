var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise;

describe('Test Basic Sequenced Promise', () => {
    it('Test two fulfilled promise seq with both hooks', (done) => {
        var output = [];
        (new Promise((resolve) => {
            resolve('resolved promise');
        }))
            .then(val => {
                output.push(val);
                return 'seq resolved';
            }, lib.failBranch(done))
            .then(val => {
                output.push(val);
                setTimeout(() => {
                    assert.deepEqual(output, ['resolved promise', 'seq resolved']);
                    done();
                }, 0);
            }, lib.failBranch(done));
    });

    it('Test two rejected promise seq with both hooks (second rejected by error)', (done) => {
        var output = [];
        (new Promise((resolve, reject) => {
            reject('rejected promise');
        }))
            .then(lib.failBranch(done), reason => {
                output.push(reason);
                throw new Error('seq rejected by exception');
            })
            .then(lib.failBranch(done), reason => {
                output.push(reason.message);
                setTimeout(() => {
                    assert(reason instanceof Error);
                    assert.deepEqual(output, ['rejected promise', 'seq rejected by exception']);
                    done();
                }, 0);
            });
    });

    it('Test promise seq with random hooks', (done) => {
        var output = [];
        (new Promise((resolve) => {
            resolve('resolved');
        }))
            .then(null, lib.failBranch(done))
            .then(val => {output.push(val); return 'second resolved'; })
            .then(null, lib.failBranch(done))
            .then(null, lib.failBranch(done))
            .then(val => {output.push(val); throw new Error('third rejected');}, lib.failBranch(done))
            .then(lib.failBranch(done), null)
            .then(null, reason => {
                output.push(reason.message);
                setTimeout(() => {
                    assert(reason instanceof Error);
                    assert.deepEqual(output, ['resolved', 'second resolved', 'third rejected']);
                    done();
                }, 0);
            });
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
