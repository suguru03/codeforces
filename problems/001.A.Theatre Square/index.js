'use strict';
const nums = readline().match(/\d+/g).map(n => +n);
const m = nums.shift();
const n = nums.shift();
const a = nums.shift();

if (m <= a || n <= a) {
  print(Math.ceil(m < n ? n / a : m / a));
} else {
  print(Math.ceil(m / a) * Math.ceil(n / a));
}

