import test from 'unit.js';
import lib from './../lib';
import Promise from '../../src/Promise';

describe('Test Promise .finally', () => {
    it('Test finally for resolved promise', (done) => {
        const output = [];
        (new Promise((resolve) => {
            resolve('resolved');
        })).finally((valueOrReason) => {
            output.push(valueOrReason);
        }).then((value) => {
            output.push(value);
            setTimeout(() => {
                test.array(output).is(['resolved', 'resolved']);
                done();
            }, 0);
        });
    });

    it('Test finally for rejected promise', (done) => {
        const output = [];
        (new Promise((resolve, reject) => {
            reject('rejected');
        })).finally((valueOrReason) => {
            output.push(valueOrReason);
        }).then(null, (reason) => {
            output.push(reason);
            setTimeout(() => {
                test.array(output).is(['rejected', 'rejected']);
                done();
            }, 0);
        });
    });

    it('Test multiple finally calls (include "catch" usage)', (done) => {
        const output = [];
        (new Promise(() => {
            throw new Error('first rejected');
        })).finally((valueOrReason) => {
            output.push(valueOrReason.message);
        }).catch((reason) => {
            output.push(reason.message);
            return 'second resolved';
        }).finally((value) => {
            output.push(value);
            return lib.FAIL;
        }).finally((value) => {
            output.push(value);
            return lib.FAIL;
        }).then((value) => {
            output.push(value);
            setTimeout(() => {
                test.array(output).is([
                    'first rejected',
                    'first rejected',
                    'second resolved',
                    'second resolved',
                    'second resolved'
                ]);
                done();
            }, 0);
        });
    });
});
