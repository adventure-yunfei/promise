/**
 * Created by yunfei on 12/9/15.
 */
import test from 'unit.js';

export default {
    FAIL: '__fail__',
    failTest(cb, timeout) {
        setTimeout(() => {
            test.assert(false);
            cb();
        }, timeout || 0);
    }
};