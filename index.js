'use strict';

const {
    throwDefaultError,
    throwOnReassignment
} = require('./dependencies/errorHandlers');

function buildPredicaryBase(defaultCase) {
    return function () {
        return defaultCase.action()
    }
}

function deferredIdentity(value) {
    return function () {
        return value;
    }
}

const alwaysTrue = deferredIdentity(true);

function newPredicary() {
    let registeredPredicates = {};
    let defaultCase = {
        action: throwDefaultError
    };

    let valuePredicary = buildPredicaryBase(defaultCase);
    let predicaryApi = {};

    function setPredicateRegistration(functionString) {
        throwOnReassignment(registeredPredicates, functionString);

        registeredPredicates[functionString] = true;
    }

    function setPredicaryRecord(predicateFunctionKey, value) {
        const currentPredicary = valuePredicary;
        const deferredValue = deferredIdentity(value);

        valuePredicary = function (testValue) {
            const isMatchingValue = predicateFunctionKey(testValue);

            return (isMatchingValue ? deferredValue : currentPredicary)(testValue);
        };
    }

    function set(predicateFunctionKey, value) {
        setPredicateRegistration(predicateFunctionKey.toString());
        setPredicaryRecord(predicateFunctionKey, value);

        return predicaryApi;
    }

    function setDefaultAction(value) {
        defaultCase.action = deferredIdentity(value);
    }

    function setDefault(value) {
        setPredicateRegistration(alwaysTrue.toString());
        setDefaultAction(value);

        return predicaryApi;
    }

    function match(testValue) {
        return valuePredicary(testValue);
    }

    predicaryApi.default = setDefault;
    predicaryApi.match = match;
    predicaryApi.set = set;

    return predicaryApi;
}

module.exports = {
    new: newPredicary
}