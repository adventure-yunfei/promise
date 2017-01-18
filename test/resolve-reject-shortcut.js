var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise,
    failBranch = lib.failBranch;

describe('Promise.resolve/reject shortcut', () => {
    const _checkValue = (expectedVal, done) => value => setTimeout(() => {
        assert.equal(value, expectedVal);
        done();
    }, 0);

    it('Promise.resolved primitive', (done) => {
        Promise.resolve('resolved_1')
            .then(_checkValue('resolved_1', done), failBranch(done));
    });

    it('Promise.resolved promise', (done) => {
        Promise.resolve(Promise.resolve('resolved_2'))
            .then(_checkValue('resolved_2', done), failBranch(done));
    });
    it('Promise.resolved thenable', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {onFulfill('resolved_3');}})
            .then(_checkValue('resolved_3', done), failBranch(done));
    });
    it('Promise.resolved async thenable', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {setTimeout(() => onFulfill('resolved_4'), 50);}})
            .then(_checkValue('resolved_4', done), failBranch(done));
    });
    it('Promise.resolve rejected promise', (done) => {
        Promise.resolve(Promise.reject('rejected_1'))
            .then(failBranch(done), _checkValue('rejected_1', done));
    });
    it('Promise.resolve rejected thenable', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {onReject('rejected_2');}})
            .then(failBranch(done), _checkValue('rejected_2', done));
    });
    it('Promise.resolve async rejected thenable', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {setTimeout(() => onReject('rejected_3'), 50);}})
            .then(failBranch(done), _checkValue('rejected_3', done));
    });

    it('Promise.reject', (done) => {
        Promise.reject('rejected')
            .then(failBranch(done), _checkValue('rejected', done));
    });

    it('Promise.reject promise', (done) => {
        // Promise.reject will pass promise instance itself directly
        var _promise = Promise.reject('rejected');
        _promise.catch(() => 0);
        Promise.reject(_promise)
            .then(failBranch(done), _checkValue(_promise, done));
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
