/**
 * Created by yunfei on 12/9/15.
 */
import test from 'unit.js';
import lib from './lib';
import Promise from '../src/Promise';

describe('Test Sequenced Promise provided with hook returning promise (or thenable)', () => {
    it('Test promise with hooks returning promise or thenable', (done) => {
        var output = [];
        (new Promise((resolve) => {
            resolve('resolved promise');
        })).then(function onFulfilled(value) {
                output.push(value);
                return new Promise((resolve, reject) => {
                    reject('second rejected');
                });
            }, function onRejected() {output.push(lib.FAIL);})
            .then(function onFulfilled() {output.push(lib.FAIL);}, function onRejected(reason) {
                output.push(reason);
                return {
                    then: (success, fail) => {
                        fail('third rejected');
                    }
                };
            })
            .then(null, (reason) => {
                output.push(reason);
                return {
                    then: 'resolved: wrong thenable object'
                };
            })
            .then((value) => {
                output.push(value.then);
                setTimeout(() => {
                    test.array(output)
                        .is(['resolved promise', 'second rejected', 'third rejected', 'resolved: wrong thenable object']);
                    done();
                }, 0);
            }, null);
    });
});