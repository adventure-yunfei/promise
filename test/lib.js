var process = require('process'),
    assert = require('assert');

module.exports = {
    Promise: require('../lib/Promise'),

    failBranch: done => () => done('Unexpected branch that should not reach'),

    expectedUncaughtException(validateError, callback) {
        assert.equal(process.listenerCount('uncaughtException'), 1);
        const originalErrorHandler = process.listeners('uncaughtException').pop(),
            newHandler = function (error) {
                if (validateError(error)) {
                    callback(error);
                    process.removeListener('uncaughtException', newHandler);
                    process.addListener('uncaughtException', originalErrorHandler);
                } else {
                    originalErrorHandler.apply(this, arguments);
                }
            };
        process.removeListener('uncaughtException', originalErrorHandler);
        process.addListener('uncaughtException', newHandler);
    }
};
