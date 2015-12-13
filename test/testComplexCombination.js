/**
 * Created by yunfei on 12/9/15.
 */
import test from 'unit.js';
import lib from './lib';
import Promise from '../src/Promise';

describe('Test Complex Promise Combination', () => {
    it('Test Promise Combination with: multi-bind for the same promise, thenable hook, reject by error, seq', (done) => {
        var output = [],
            p = (new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject('first rejected');
                }, 20);
            }))
                .then(null, null)
                .then(() => {output.push(lib.FAIL);})
                .then(null, (reason) => {
                    output.push(reason);
                    throw new Error('second rejected by exception');
                })
                .then(),
            p2 = p.then(() => {output.push(lib.FAIL);}, (reason) => {output.push('p2: ' + reason.message);})
                .then((value) => {output.push(value ? lib.FAIL : 'p2: third resolved')}),
            p3 = p.then(null, (reason) => {
                output.push('p3: ' + reason.message);
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('p3: third resolved');
                    }, 20);
                });
            })
                .then((value) => {
                    output.push(value);
                    return {
                        then: (onFulfilled) => {
                            setTimeout(() => {
                                onFulfilled('p3: forth resolved');
                            }, 20);
                        }
                    };
                }, () => {output.push(lib.FAIL)})
                .then(null, () => {output.push(lib.FAIL)})
                .then((value) => {
                    output.push(value);
                    setTimeout(() => {
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
                .then(() => {lib.failTest(done, 1000);}, () => {lib.failTest(done, 1000);});
    });
});