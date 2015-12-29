/**
 * Created by yunfei on 12/9/15.
 */
import test from 'unit.js';
import lib from './lib';
import Promise from '../src/Promise';

describe('Test Basic Sequenced Promise', () => {
    it('Test two fulfilled promise seq with both hooks', (done) => {
        var output = [];
        (new Promise((resolve) => {
            resolve('resolved promise');
        })).then(function onFulfilled(value) {
            output.push(value);
            return 'seq resolved';
        }, function onRejected() {
            output.push(lib.FAIL);
        }).then(function onFulfilled(value) {
            output.push(value);
            setTimeout(() => {
                test.array(output).is(['resolved promise', 'seq resolved']);
                done();
            }, 0);
        }, function onRejected() {
            lib.failTest(done);
        });
    });

    it('Test two rejected promise seq with both hooks (second rejected by error)', (done) => {
        var output = [];
        (new Promise((resolve, reject) => {
            reject('rejected promise');
        })).then(function onFulfilled() {
            output.push(lib.FAIL);
        }, function onRejected(reason) {
            output.push(reason);
            throw new Error('seq rejected by exception');
        }).then(function onFulfilled() {
            output.push(lib.FAIL);
        }, function onRejected(reason) {
            output.push(reason.message);
            setTimeout(() => {
                test.array(output).is(['rejected promise', 'seq rejected by exception']);
                done();
            }, 0);
        });
    });

    it('Test promise seq with random hooks', (done) => {
        var output = [];
        (new Promise((resolve) => {
            resolve('resolved');
        })).then(null, () => {output.push(lib.FAIL);})
            .then((value) => {output.push(value); return 'second resolved'; }, null)
            .then(null, () => {output.push(lib.FAIL);})
            .then(null, () => {output.push(lib.FAIL);})
            .then((value) => {output.push(value); throw new Error('third rejected');}, () => {output.push(lib.FAIL);})
            .then(() => {output.push(lib.FAIL);}, null)
            .then(null, (reason) => {
                output.push(reason.message);
                setTimeout(() => {
                    test.array(output).is(['resolved', 'second resolved', 'third rejected']);
                    done();
                }, 0);
            });
    });
});
