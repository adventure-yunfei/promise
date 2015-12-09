/**
 * Created by yunfei on 9/9/15.
 */
var test = require('unit.js'),
    lib = require('./lib'),
    Promise = require('../src/Promise');

describe('Test Basic Promise', function () {
    it('Fulfilled Promise', function (done) {
        var p = new Promise(function (resolve) {
                resolve('resolved');
            });

        p.then(function (value) {
            setTimeout(function () {
                test.assert.equal(value, 'resolved');
                done();
            }, 0);
        }, function () {
            lib.failTest(done);
        });
    });

    it('Rejected Promise', function (done) {
        var p = new Promise(function (resolve, reject) {
                reject('rejected');
            });

        p.then(function () {
            lib.failTest(done);
        }, function (reason) {
            setTimeout(function () {
                test.assert.equal(reason, 'rejected');
                done();
            }, 0);
        });
    });

    it('Rejected Promise (rejected by error)', function (done) {
        (new Promise(function () {
            throw new Error('by exception');
        })).then(function () {
            lib.failTest(done);
        }, function (reason) {
            setTimeout(function () {
                test.assert.equal(reason.message, 'by exception');
                done();
            }, 0);
        });
    });

    it('Fulfilled Promise with two "then" binding', function (done) {
        var p = new Promise(function (resolve) {
                resolve('resolved');
            }),
            firstOutput;

        p.then(function (value) {
            firstOutput = value;
        }, function () {
            lib.failTest(done);
        });

        p.then(function (value) {
            setTimeout(function () {
                test.assert.equal(firstOutput, 'resolved');
                test.assert.equal(value, 'resolved');
                done();
            }, 0);
        }, function () {
            lib.failTest(done);
        });
    });

    it('Rejected Promise with two "then" binding', function (done) {
        var rejectedObj = {a: 1},
            p = new Promise(function (resolve, reject) {
                reject(rejectedObj);
            }),
            firstOutput;

        p.then(function () {
            lib.failTest(done);
        }, function (reason) {
            firstOutput = reason;
        });

        p.then(function () {
            lib.failTest(done);
        }, function (reason) {
            setTimeout(function () {
                test.assert.equal(firstOutput, rejectedObj);
                test.assert.equal(reason, rejectedObj);
                done();
            }, 0);
        });
    });

    it('Async Rejected Promise', function (done) {
        var p = new Promise(function (resolve, reject) {
            setTimeout(reject('rejected'), 50);
        });

        p.then(function () {
            lib.failTest(done);
        }, function (reason) {
            setTimeout(function () {
                test.assert.equal(reason, 'rejected');
                done();
            }, 0);
        });
    });
});