const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);

if (!scriptMatch) {
  console.error('Could not find main script tag in index.html');
  process.exit(1);
}

const scriptCode = scriptMatch[1];

try {
  new vm.Script(scriptCode);
  console.log('Script syntax check passed! Zero syntax errors.');
} catch (err) {
  console.error('Script syntax error:', err);
  process.exit(1);
}
