/**
 * Created by yunfei on 12/14/15.
 */
import test from 'unit.js';
import lib from './../lib';
import Promise from '../../src/Promise';

describe('Test Promise.resolve/reject shortcut', () => {
    it('Test Promise.resolve', (done) => {
        Promise.resolve('resolved')
            .then((value) => {
                setTimeout(() => {
                    test.string(value).is('resolved');
                    done();
                }, 0);
            }, () => {
                lib.failTest(done);
            });
    });

    it('Test Promise.reject', (done) => {
        Promise.reject('rejected')
            .then(() => {
                lib.failTest(done);
            }, (reason) => {
                setTimeout(() => {
                    test.string(reason).is('rejected');
                    done();
                }, 0);
            });
    });
});
