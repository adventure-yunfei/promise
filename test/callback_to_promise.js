import test from 'unit.js';
import callback_to_promise from '../src/callback_to_promise';

function callbackStyleFunc(a, b, error, callback) {
    setTimeout(() => {
        const result = [a, b, this.c]
            .map((item) => item.toString())
            .join('');
        callback && callback(error, result);
    });
}

describe('Test callback to promise transforming', function () {
    it('Callback without error', function (done) {
        callback_to_promise(callbackStyleFunc).call({c: 3}, 1, 2, null)
            .then((result) => {
                setTimeout(() => {
                    test.string(result).is('123');
                    done();
                }, 0);
            })
            .catch(() => done(true));
    });
    it('Callback with error', function (done) {
        callback_to_promise(callbackStyleFunc).call({c: 3}, 1, 2, 'error')
            .then(() => done(true))
            .catch((error) => {
                setTimeout(() => {
                    test.string(error).is('error');
                    done();
                });
            });
    });
});
