import Promise from './Promise';

/**
 * Turn:
 *   func(a1, a2, ..., an, callback(err, data))
 * to:
 *   func(a1, a2, ..., an).then((data) => ..., (err) => ...)
 *
 * @param {Function} func Function that accepts a callback as the last parameter
 */
export default function callback_to_promise(func) {
    return function promisedFunc() {
        return new Promise((resolve, reject) => {
            func.call(this, ...arguments, function callback(error, data) {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    };
}
