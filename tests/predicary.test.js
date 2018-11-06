'use strict';

const { assert } = require('chai');
const predicary = require('../index');

describe('predicary', function () {
    let testPredicary;

    beforeEach(function () {
        testPredicary = predicary.new();
    });

    describe('default', function () {
        it('returns original predicary for chained operations', function () {
            const returnedValue = testPredicary.default('My Value');

            assert.equal(returnedValue, testPredicary);
        });

        it('sets the default value for the current predicary', function () {
            const result = testPredicary
                .default('My Value')
                .match('foo');

            assert.equal(result, 'My Value');
        });

        it('throws an error if default value is already assigned', function () {
            testPredicary.default('A Value');

            assert.throws(() => testPredicary.default('Another Value'));
        });
    });

    describe('match', function () {
        it('returns value keyed by matched predicate function', function () {
            testPredicary.set(x => true, 'A Test Value');
            const result = testPredicary.match('always true');

            assert.equal(result, 'A Test Value');
        });

        it('returns default value if provided value does not have a match', function () {
            testPredicary
                .set(x => false, 'A Test Value')
                .default('This is a default value');

            const result = testPredicary.match('always false');

            assert.equal(result, 'This is a default value');
        });

        it('throws an error if no match is found and default value is not set', function () {
            testPredicary.set(x => false, 'A Test Value');

            assert.throws(() => testPredicary.match('always false'));
        });
    });

    describe('set', function () {
        it('sets a predicate key and value record', function () {
            testPredicary.set(value => typeof value === 'string', 'It was a string!');
            const matchedResult = testPredicary.match('a string');

            assert.equal(matchedResult, 'It was a string!');
        });

        it('returns current predicary for chaning operations', function () {
            const result = testPredicary.set(value => typeof value === 'string', 'It was a string!');

            assert.equal(result, testPredicary);
        });

        it('throws an error if attempting to set a key which already exists', function () {
            const isTrue = () => true;
            testPredicary.set(isTrue, 'foo');

            assert.throws(() => testPredicary.set(isTrue, 'bar'));
        });
    });
});