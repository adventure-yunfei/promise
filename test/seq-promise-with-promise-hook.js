var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise,
    failBranch = lib.failBranch;

describe('Test Sequenced Promise provided with hook returning promise (or thenable)', () => {
    it('Test promise with hooks returning promise or thenable', (done) => {
        var output = [];
        (new Promise((resolve) => {
            resolve('resolved promise');
        }))
            .then(value => {
                output.push(value);
                return new Promise((resolve, reject) => {
                    reject('second rejected');
                });
            }, failBranch(done))
            .then(failBranch(done), reason => {
                output.push(reason);
                return {
                    then: (success, fail) => {
                        fail('third rejected');
                    }
                };
            })
            .then(null, reason => {
                output.push(reason);
                return {
                    then: 'resolved: wrong thenable object'
                };
            })
            .then(value => {
                output.push(value);
                setTimeout(() => {
                    assert.deepEqual(output, ['resolved promise', 'second rejected', 'third rejected', {then: 'resolved: wrong thenable object'}]);
                    done();
                }, 0);
            }, null);
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
