/**
 * Created by yunfei on 9/9/15.
 */
var test = require('unit.js'),
    Promise = require('../src/promise');

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
            setTimeout(function () {
                test.assert(false);
                done();
            }, 0);
        });
    });

    it('Rejected Promise', function (done) {
        var p = new Promise(function (resolve, reject) {
                reject('rejected');
            });

        p.then(function () {
            setTimeout(function () {
                test.assert(false);
                done();
            }, 0);
        }, function (reason) {
            setTimeout(function () {
                test.assert.equal(reason, 'rejected');
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
            firstOutput = 'NOT_WANTED';
        });

        p.then(function (value) {
            setTimeout(function () {
                test.assert.equal(firstOutput, 'resolved');
                test.assert.equal(value, 'resolved');
                done();
            }, 0);
        }, function () {
            setTimeout(function () {
                test.assert(false);
                done();
            }, 0);
        });
    });

    it('Rejected Promise with two "then" binding', function (done) {
        var rejectedObj = {a: 1},
            p = new Promise(function (resolve, reject) {
                reject(rejectedObj);
            }),
            firstOutput;

        p.then(function () {
            setTimeout(function () {
                test.assert(false);
                done();
            }, 0);
        }, function (reason) {
            firstOutput = reason;
        });

        p.then(function () {
            setTimeout(function () {
                test.assert(false);
                done();
            }, 0);
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
            setTimeout(function () {
                test.assert(false);
                done();
            }, 0);
        }, function (reason) {
            setTimeout(function () {
                test.assert.equal(reason, 'rejected');
                done();
            }, 0);
        });
    });
});