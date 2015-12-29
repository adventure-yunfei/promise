/**
 * Created by yunfei on 12/14/15.
 */
import test from 'unit.js';
import lib from './lib';
import Promise from '../src/Promise';

describe('Test Promise .catch shortcut', () => {
    it('Test catch for resolved promise', (done) => {
        (new Promise((resolve) => {
            resolve('resolved');
        })).catch(() => {
            lib.failTest(done);
        });
        setTimeout(done, 50);
    });

    it('Test catch for rejected promise', (done) => {
        (new Promise((resolve, reject) => {
            reject('rejected');
        })).catch((reason) => {
            setTimeout(() => {
                test.assert.equal(reason, 'rejected');
                done();
            }, 0);
        });
    });

    it('Test catch effecting promise state', (done) => {
        const output = [];
        (new Promise(() => {
            throw new Error('first rejected');
        })).catch((reason) => {
            output.push(reason.message);
            return 'second resolved';
        }).then((value) => {
            output.push(value);
            return 'third resolved';
        }).catch(() => {
            output.push(lib.FAIL);
        }).then((value) => {
            output.push(value);
            setTimeout(() => {
                test.array(output).is([
                    'first rejected',
                    'second resolved',
                    'third resolved'
                ]);
                done();
            }, 0);
        });
    });
});
