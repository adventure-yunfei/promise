import Promise from './Promise';

/**
 * Turn:
 *   func(a1, a2, ..., an, callback(err, data))
 * to:
 *   func(a1, a2, ..., an).then((data) => ..., (err) => ...)
 *
 * @param {Function} func Function that accepts a callback as the last parameter
 * @param resolvedAsArray Whether to resolve promise data as array (to allow multiple data arguments in callback)<br/>
 *          Otherwise only the first data argument is received
 */
export default function callback_to_promise(func, {resolvedAsArray = false} = {}) {
    return function promisedFunc() {
        return new Promise((resolve, reject) => {
            func.call(this, ...arguments, function callback(error, ...dataArray) {
                if (error) {
                    reject(error);
                } else {
                    resolve(resolvedAsArray ? dataArray : dataArray[0]);
                }
            });
        });
    };
}
