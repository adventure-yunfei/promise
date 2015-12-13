import Defer from './Defer';

export default function Promise(fnResolver) {
    var deferred = new Defer(fnResolver);
    return deferred.getPromise();
}