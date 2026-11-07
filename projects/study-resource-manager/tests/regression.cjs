const assert = require('node:assert/strict');
const fs = require('node:fs');

const source = fs.readFileSync('projects/study-resource-manager/script.js', 'utf8');

assert.match(source, /type:\$('typeInput')\.value/, 'resource type must use the getElementById helper');
assert.doesNotMatch(source, /type:\$\(['"]#typeInput['"]\)\.value/, 'jQuery-style selector must not be passed to getElementById helper');
assert.match(source, /load\('studyResources',seed\)[\s\S]*?\.map\(r=>\(\{[\s\S]*?id:typeof r\.id==='string'&&r\.id\.trim\(\)\?r\.id:makeId\(\)/, 'legacy and seed resources must receive stable IDs when missing');
assert.match(source, /url:safeUrl\(r\.url\)/, 'loaded resource URLs must be normalized to safe HTTP(S) URLs');
assert.match(source, /favorite:Boolean\(r\.favorite\)/, 'favorite state must be normalized to a boolean');

console.log('Study Resource Manager regression checks passed.');
