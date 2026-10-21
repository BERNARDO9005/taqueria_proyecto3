const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

const head = html.slice(0, html.indexOf('<body'));
const bodyHtml = html.slice(html.indexOf('<body'), html.indexOf('<script>'));
const script = html.slice(html.indexOf('<script>'));

console.log('Head len:', head.length);
console.log('Body HTML len:', bodyHtml.length);
console.log('Script len:', script.length);
console.log('Total len:', html.length);
