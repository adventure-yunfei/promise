var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise;

describe('Test Basic Promise.then', function () {
    it('.then should be async (resolved)', function (done) {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 2) {
                    assert.deepEqual(output, ['sync push', 'promise result']);
                    done();
                } else if (output.length > 2) {
                    done('Unepxected extra callback');
                }
            };
        Promise.resolve('promise result')
            .then(onGetVal);
        onGetVal('sync push');
    });

    it('.then should be async (rejected)', function (done) {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 2) {
                    assert.deepEqual(output, ['sync push', 'promise result']);
                    done();
                } else if (output.length > 2) {
                    done('Unepxected extra callback');
                }
            };
        Promise.reject('promise result')
            .then(null, onGetVal);
        onGetVal('sync push');
    });

    it('.then should be async (for async promise)', function (done) {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 3) {
                    assert.deepEqual(output, [
                        'sync push',
                        'sync push after resolve',
                        'promise result'
                    ]);
                    done();
                } else if (output.length > 3) {
                    done('Unepxected extra callback');
                }
            };
        new Promise((resolve, reject) => setTimeout(() => {
            resolve('promise result');
            onGetVal('sync push after resolve');
        }, 50))
            .then(onGetVal);
        onGetVal('sync push');
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});