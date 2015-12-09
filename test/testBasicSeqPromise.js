/**
 * Created by yunfei on 12/9/15.
 */
var test = require('unit.js'),
    lib = require('./lib'),
    Promise = require('../src/Promise');

describe('Test Basic Sequenced Promise', function () {
    it('Test two fulfilled promise seq with both hooks', function (done) {
        var output = [];
        (new Promise(function (resolve) {
            resolve('resolved promise');
        })).then(function onFulfilled(value) {
            output.push(value);
            return 'seq resolved';
        }, function onRejected() {
            output.push(lib.FAIL);
        }).then(function onFulfilled(value) {
            output.push(value);
            setTimeout(function () {
                test.array(output).is(['resolved promise', 'seq resolved']);
                done();
            }, 0);
        }, function onRejected() {
            lib.failTest(done);
        });
    });

    it('Test two rejected promise seq with both hooks (second rejected by error)', function (done) {
        var output = [];
        (new Promise(function (resolve, reject) {
            reject('rejected promise');
        })).then(function onFulfilled() {
            output.push(lib.FAIL);
        }, function onRejected(reason) {
            output.push(reason);
            throw new Error('seq rejected by exception')
        }).then(function onFulfilled() {
            output.push(lib.FAIL);
        }, function onRejected(reason) {
            output.push(reason.message);
            setTimeout(function () {
                test.array(output).is(['rejected promise', 'seq rejected by exception']);
                done();
            }, 0);
        });
    });

    it('Test promise seq with random hooks', function (done) {
        var output = [];
        (new Promise(function (resolve) {
            resolve('resolved');
        })).then(null, function () {output.push(lib.FAIL);})
            .then(function (value) {output.push(value); return 'second resolved'; }, null)
            .then(null, function () {output.push(lib.FAIL);})
            .then(null, function () {output.push(lib.FAIL);})
            .then(function (value) {output.push(value); throw new Error('third rejected');}, function () {output.push(lib.FAIL);})
            .then(function () {output.push(lib.FAIL);}, null)
            .then(null, function (reason) {
                output.push(reason.message);
                setTimeout(function () {
                    test.array(output).is(['resolved', 'second resolved', 'third rejected']);
                    done();
                }, 0);
            }).then(function () {lib.failTest(500);}, function () {lib.failTest(500);});
    });
});