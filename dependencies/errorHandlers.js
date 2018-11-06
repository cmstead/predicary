'use strict';

function throwError(message) {
    throw new Error(message);
}

function noop() { }

const errorMessages = {
    reassignmentError: 'Cannot reassign existing key/value pair.',
    noDefaultError: 'Unable to match record, please set a default.'
};

function throwDefaultError() {
    throwError(errorMessages.noDefaultError);
}

function throwReassignmentError() {
    throwError(errorMessages.reassignmentError);
}

function throwOnReassignment(registeredPredicates, functionString) {
    const isReregistration = registeredPredicates[functionString];

    (!isReregistration ? noop : throwReassignmentError)();
}


module.exports = {
    throwDefaultError: throwDefaultError,
    throwOnReassignment: throwOnReassignment
};