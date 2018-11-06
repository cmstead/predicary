'use strict';

function newPredicary() {
    let registeredPredicates = {};
    let defaultCase = () => undefined;
    let valuePredicary = () => defaultCase();

    let predicaryApi = {};

    function throwError(message) {
        throw new Error(message);
    }

    function noop() { }

    function throwOnUnmatchable(matchingRecord) {
        const errorMessage = 'Unable to match record, please set a default.';

        const matchNotFound = typeof matchingRecord === 'undefined';

        (!matchNotFound ? noop : throwError)(errorMessage);
    }

    function match(testValue) {
        const matchingValue = valuePredicary(testValue);

        throwOnUnmatchable(matchingValue);

        return matchingValue;
    }

    function throwOnReassignment(functionString) {
        const errorMessage = 'Cannot reassign existing key/value pair.';

        const isReregistration = registeredPredicates[functionString];
        const errorAction = !isReregistration ? noop : throwError;

        errorAction(errorMessage);
    }

    function setPredicateRegistration(predicateFunctionKey) {
        const functionString = predicateFunctionKey.toString();

        throwOnReassignment(functionString);

        registeredPredicates[functionString] = true;
    }

    function attachPredicaryRecord(predicateFunctionKey, value) {
        return function (testValue) {
            return predicateFunctionKey(testValue)
                ? value
                : valuePredicary(testValue);
        }
    }

    function set(predicateFunctionKey, value) {
        setPredicateRegistration(predicateFunctionKey);

        valuePredicary = attachPredicaryRecord(predicateFunctionKey, value);

        return predicaryApi;
    }

    function setDefault(value) {
        return set(function () { return true; }, value);
    }

    predicaryApi.default = setDefault;
    predicaryApi.match = match;
    predicaryApi.set = set;

    return predicaryApi;
}

module.exports = {
    new: newPredicary
}