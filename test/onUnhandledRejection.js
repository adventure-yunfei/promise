var assert = require('assert'),
    lib = require('./lib'),
    Promise = lib.Promise;

describe('Test onUnhandledRejection', function () {
    var originalHandler = null;
    before(function () {
        originalHandler = Promise.onUnhandledRejection;
    });

    after(function () {
        Promise.onUnhandledRejection = originalHandler;
    });

    it('onUnhandledRejection basic trigger', function (done) {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 2) {
                    assert.deepEqual(output, ['rejected 1', 'rejected 2']);
                    done();
                } else if (output.length > 2) {
                    done('Unepxected extra callback');
                }
            };
        Promise.onUnhandledRejection = onGetVal;

        Promise.reject('rejected 1');
        Promise.reject('rejected 2');
    });

    it('onUnhandledRejection trigger or silent for handled rejection', function (done) {
        var output = [],
            onGetVal = val => {
                output.push(val);
                if (output.length === 2) {
                    setTimeout(() => {
                        if (!(output[0] instanceof Error)) {
                            output.reverse();
                        }
                        assert.equal(output[0] && output[0].message, 'error 2');
                        assert.equal(output[1], 'rejected 4');
                        done();
                    }, 0);
                } else if (output.length > 2) {
                    done('Unepxected extra callback');
                }
            },
            noop = () => {};
        Promise.onUnhandledRejection = onGetVal;

        Promise.resolve('resolved');

        Promise.reject('rejected 1')
            .catch(noop);

        Promise.reject('rejected 2')
            .catch(() => {throw new Error('error 2'); })
            .then()
            .then(noop)
            .then();

        Promise.reject('rejected 3')
            .catch(() => {throw new Error('error 3'); })
            .then()
            .then(null, noop);
        
        Promise.resolve('resolved 4')
            .then()
            .then(null, noop)
            .then(() => {Promise.reject('rejected 4');}, noop);
    });

    it('Dummy Wait...', done => {
        setTimeout(done, 500);
    });
});