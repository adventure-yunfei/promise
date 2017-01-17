export default function __assert__(condition, errMsg = '') {
    if (!condition) {
        throw new Error('__assert__ failed. ' + errMsg);
    }
}
