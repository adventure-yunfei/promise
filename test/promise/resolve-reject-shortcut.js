/**
 * Created by yunfei on 12/14/15.
 */
import test from 'unit.js';
import lib from './../lib';
import Promise from '../../src/Promise';

describe('Test Promise.resolve/reject shortcut', () => {
    const _failTest = done => () => lib.failTest(done),
        _checkValue = (expectedVal, done) => value => setTimeout(() => {
            test.string(value).is(expectedVal);
            done();
        }, 0);

    it('Test Promise.resolved 1', (done) => {
        Promise.resolve('resolved_1')
            .then(_checkValue('resolved_1', done), _failTest(done));
    });

    it('Test Promise.resolved 2', (done) => {
        Promise.resolve(Promise.resolve('resolved_2'))
            .then(_checkValue('resolved_2', done), _failTest(done));
    });
    it('Test Promise.resolved 3', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {onFulfill('resolved_3');}})
            .then(_checkValue('resolved_3', done), _failTest(done));
    });
    it('Test Promise.resolved 4', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {setTimeout(() => onFulfill('resolved_4'), 50);}})
            .then(_checkValue('resolved_4',done), _failTest(done));
    });
    it('Test Promise.resolve 5', (done) => {
        Promise.resolve(Promise.reject('rejected_1'))
            .then(_failTest(done), _checkValue('rejected_1', done));
    });
    it('Test Promise.resolve 6', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {onReject('rejected_2');}})
            .then(_failTest(done), _checkValue('rejected_2', done));
    });
    it('Test Promise.resolve 7', (done) => {
        Promise.resolve({then: (onFulfill, onReject) => {setTimeout(() => onReject('rejected_3'), 50);}})
            .then(_failTest(done), _checkValue('rejected_3', done));
    });

    it('Test Promise.reject', (done) => {
        Promise.reject('rejected')
            .then(_failTest(done), _checkValue('rejected', done));
    });
});
