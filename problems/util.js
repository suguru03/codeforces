'use strict';

const fs = require('fs');
const path = require('path');

const _ = require('lodash');
const { Agent } = require('vm-agent');

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

class Test {
  constructor(dirpath) {
    const filepath = path.resolve(dirpath, 'index.js');
    const context = Object.assign({}, global);
    const result = [];
    this._input = undefined;
    this._result = result;
    context.readline = () => this._input;
    context.print = function() {
      const args = _.toArray(arguments);
      result.push(args.join(' '));
    };
    this._agent = new Agent(fs.readFileSync(filepath, 'utf8'), context);
  }
  exec(input) {
    this._input = input || '';
    this._result.length = 0;
    this._agent.run();
    return this._result.join('\n');
  }
}
const counts = {
  passing: 0,
  failing: 0
};

global.describe = ((title, task) => {
  console.log(`  ${title}`);
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

module.exports = { set, exec };

let test;

function set(dirname) {
  test = new Test(dirname);
}

function exec(input) {
  return test.exec(input);
}
