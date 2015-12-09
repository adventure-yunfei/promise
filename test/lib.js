/**
 * Created by yunfei on 12/9/15.
 */
var test = require('unit.js');

module.exports = {
    FAIL: '__fail__',
    failTest: function (cb, timeout) {
        setTimeout(function () {
            test.assert(false);
            cb();
        }, timeout || 0);
    }
};