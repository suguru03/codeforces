'use strict';

const assert = require('assert');
const _ = require('lodash');
const { exec } = require('../util');

describe('#Theatre Square', () => {

  const tests = [{
    input: '6 6 4',
    result: '4'
  }, {
    input: '2 6 4',
    result: '2'
  }, {
    input: '2 2 4',
    result: '1'
  }, {
    input: '9 5 4',
    result: '6'
  }, {
    input: '2 1 2',
    result: '1'
  }, {
    input: '9 5 1',
    result: '45'
  }];

  _.forEach(tests, ({ input, result }) => {
    it(`input: ${input} => ${result}`, () => {
      assert.strictEqual(exec(input), result);
    });
  });
});
