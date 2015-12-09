/**
 * Created by yunfei on 12/9/15.
 */
var test = require('unit.js'),
    lib = require('./lib'),
    Promise = require('../src/Promise');

describe('Test Sequenced Promise provided with hook returning promise (or thenable)', function () {
    it('Test promise with hooks returning promise or thenable', function (done) {
        var output = [];
        (new Promise(function (resolve) {
            resolve('resolved promise');
        })).then(function onFulfilled(value) {
                output.push(value);
                return new Promise(function (resolve, reject) {
                    reject('second rejected');
                });
            }, function onRejected() {output.push(lib.FAIL);})
            .then(function onFulfilled() {output.push(lib.FAIL);}, function onRejected(reason) {
                output.push(reason);
                return {
                    then: function (success, fail) {
                        fail('third rejected');
                    }
                };
            })
            .then(null, function (reason) {
                output.push(reason);
                return {
                    then: 'resolved: wrong thenable object'
                };
            })
            .then(function (value) {
                output.push(value.then);
                setTimeout(function () {
                    test.array(output)
                        .is(['resolved promise', 'second rejected', 'third rejected', 'resolved: wrong thenable object']);
                    done();
                }, 0);
            }, null)
            .then(function () {lib.failTest(500);}, function () {lib.failTest(500);});
    });
});