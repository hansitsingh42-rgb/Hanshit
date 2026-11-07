const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const sourcePath = path.join(__dirname, '..', 'script.js');
const source = fs.readFileSync(sourcePath, 'utf8');

// This project defines $ as getElementById, not querySelector.
assert.match(source, /const\s+\$\s*=\s*id\s*=>\s*document\.getElementById\(id\)/);
assert.match(source, /type:\s*\$\('typeInput'\)\.value/);
assert.doesNotMatch(source, /\$\(['"]#typeInput['"]\)/);
assert.match(source, /resourceForm['"]?\)?\.addEventListener\(['"]submit['"]/);

console.log('PASS: resource type selector uses the project ID helper');
console.log('PASS: resource form submit handler is present');
