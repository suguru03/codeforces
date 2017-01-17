'use strict';

const fs = require('fs');
const vm = require('vm');
const path = require('path');

const _ = require('lodash');

const colors = _.mapValues({
  pass: 90,
  fail: 31,
  'bright pass': 92,
  'bright fail': 91,
  'bright yellow': 93,
  pending: 36,
  suite: 0,
  'error title': 0,
  'error message': 31,
  'error stack': 90,
  checkmark: 32,
  fast: 90,
  medium: 33,
  slow: 31,
  green: 32,
  light: 90,
  'diff gutter': 90,
  'diff added': 32,
  'diff removed': 31,
  reset: 0
}, code => {
  return `\u001b[${code}m`;
});
const c = {
  pass: '✓',
  fail: ')',
  pending: '-'
};

const counts = {
  passing: 0,
  failing: 0
};

module.exports = { exec };

global.describe = ((title, task) => {
  console.log(`\n  ${title}`);
  global.it = ((name, task) => {
    try {
      task();
      counts.passing++;
      console.log(`    ${colors.green}${c.pass} ${colors.pass}${name}${colors.reset}`);
    } catch(e) {
      console.log(`    ${colors.fail}${++counts.failing}${c.fail} ${name}${colors.reset}`);
      const stack = e.stack.split(/\n/);
      _.forEach(stack, msg => {
        console.log(`\t${colors.fail}${msg}${colors.reset}`);
      });
    }
  });
  task();
});

process.on('exit', () => {
  console.log(`\n  ${colors.green}${counts.passing} passing ${colors.pass}`);
  if (counts.failing) {
    console.log(`  ${colors.fail}${counts.failing} failing${colors.reset}`);
  }
  console.log('');
});

function exec(input) {
  const filepath = getFilepath();
  const context = Object.assign({}, global);
  context.readline = () => input;
  const result = [];
  context.print = function() {
    const args = _.toArray(arguments);
    result.push(args.join(' '));
  };
  vm.runInNewContext(fs.readFileSync(filepath, 'utf8'), context);
  return result.join('\n');
}

function getFilepath() {
  const trace = new Error().stack.split('\n');
  const dirpath = _.get(trace[3].match(/\((.*)\/test.js/), [1], '');
  if (!dirpath) {
    throw new Error('filepath not found');
  }
  return path.resolve(dirpath, 'index.js');
}
