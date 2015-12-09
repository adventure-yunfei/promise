/**
 * Created by yunfei on 12/9/15.
 */
var test = require('unit.js'),
    lib = require('./lib'),
    Promise = require('../src/promise');

describe('Test Complex Promise Combination', function () {
    it('Test Promise Combination with: multi-bind for the same promise, thenable hook, reject by error, seq', function (done) {
        var output = [],
            p = (new Promise(function (resolve, reject) {
                setTimeout(function () {
                    reject('first rejected');
                }, 20);
            }))
                .then(null, null)
                .then(function () {output.push(lib.FAIL);})
                .then(null, function (reason) {
                    output.push(reason);
                    throw new Error('second rejected by exception');
                })
                .then(),
            p2 = p.then(function () {output.push(lib.FAIL);}, function (reason) {output.push('p2: ' + reason.message);})
                .then(function (value) {output.push(value ? lib.FAIL : 'p2: third resolved')}),
            p3 = p.then(null, function (reason) {
                output.push('p3: ' + reason.message);
                return new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve('p3: third resolved');
                    }, 20);
                });
            })
                .then(function (value) {
                    output.push(value);
                    return {
                        then: function (onFulfilled) {
                            setTimeout(function () {
                                onFulfilled('p3: forth resolved');
                            }, 20);
                        }
                    };
                }, function () {output.push(lib.FAIL)})
                .then(null, function () {output.push(lib.FAIL)})
                .then(function (value) {
                    output.push(value);
                    setTimeout(function () {
                        test.array(output).is([
                            'first rejected',
                            'p2: second rejected by exception',
                            'p2: third resolved',
                            'p3: second rejected by exception',
                            'p3: third resolved',
                            'p3: forth resolved'
                        ]);
                        done();
                    }, 0);
                })
                .then(function () {lib.failTest(done, 1000);}, function () {lib.failTest(done, 1000);});
    });
});