const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
console.log('Total inline scripts found:', scripts.length);

const mainScript = scripts[scripts.length - 1][1];

try {
  new vm.Script(mainScript);
  console.log('Main JavaScript syntax check PASSED! Zero syntax errors.');
} catch (err) {
  console.error('Script syntax error:', err);
  process.exit(1);
}
