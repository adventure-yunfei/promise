var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise,
    failBranch = lib.failBranch;

describe('Test Complex Promise Combination', () => {
    it('Promise Combination with: multi-bind for the same promise, thenable hook, reject by error, seq', (done) => {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 6) {
                    var orderMatch = expectedVals => {
                        var idxs = expectedVals.map(val => output.indexOf(val)),
                            prevIdx = idxs[0],
                            isSameOrder = idxs.slice(1).every(idx => {
                                var result = idx > prevIdx;
                                prevIdx = idx;
                                return result;
                            });
                        if (!isSameOrder) {
                            assert.fail('promise results order is not correct');
                        }
                    };
                    orderMatch(['first rejected', 'p2: second rejected by exception', 'p2: third resolved']);
                    orderMatch(['first rejected', 'p3: second rejected by exception', 'p3: third resolved', 'p3: forth resolved']);
                    done();
                } else if (output.length > 6) {
                    done('Unepxected extra callback');
                }
            },
            p = (new Promise((resolve, reject) => {
                setTimeout(() => {
                    reject('first rejected');
                }, 20);
            }))
                .then(null, null)
                .then(failBranch(done))
                .then(null, reason => {
                    onGetVal(reason);
                    throw new Error('second rejected by exception');
                })
                .then();

        p
            .then(failBranch(done), reason => {
                onGetVal('p2: ' + reason.message);
                return 'p2: third resolved';
            })
            .then(onGetVal);

        p
            .then(null, reason => {
                onGetVal('p3: ' + reason.message);
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve('p3: third resolved');
                    }, 20);
                });
            })
            .then(value => {
                onGetVal(value);
                return {
                    then: (onFulfilled) => {
                        setTimeout(() => {
                            onFulfilled('p3: forth resolved');
                        }, 20);
                    }
                };
            }, failBranch(done))
            .then(null, failBranch(done))
            .then(onGetVal);
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});
