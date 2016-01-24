/**
 * Created by yunfei on 12/21/15.
 */
import test from 'unit.js';
import Promise from '../../src/Promise';

describe('Test Promise.all/race shortcut', () => {
    it('Test Promise.all with all resolved', (done) => {
        Promise.all([
            new Promise((resolve) => {
                setTimeout(() => resolve('resolved 1'), 0);
            }),
            new Promise((resolve) => {
                resolve('resolved 2');
            }),
            Promise.resolve('resolved 3'),
            {
                then: (onFulfilled) => {
                    setTimeout(() => onFulfilled('resolved 4'), 0);
                }
            }
        ]).then((values) => {
            setTimeout(() => {
                test.array(values).is([
                    'resolved 1',
                    'resolved 2',
                    'resolved 3',
                    'resolved 4'
                ]);
                done();
            });
        });
    });

    it('Test Promise.race with rejected', (done) => {
        Promise.race([
            new Promise((resolve, reject) => {
                setTimeout(() => reject('rejected 1'), 0);
            }),
            new Promise((resolve) => {
                setTimeout(() => resolve('resolved 2'), 0);
            }),
            {
                then: (onFulfilled, onRejected) => {
                    onRejected('rejected 4');
                }
            },
            Promise.reject('rejected 5')
        ]).then(null, (reason) => {
            setTimeout(() => {
                test.string(reason).is('rejected 4');
                done();
            });
        });
    });
});
