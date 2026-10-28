const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
console.log('Total length:', html.length);
console.log('modal-admin index:', html.indexOf('id="modal-admin"'));
console.log('renderAdminCatalog index:', html.indexOf('function renderAdminCatalog()'));
console.log('DEFAULT_CATALOG index:', html.indexOf('const DEFAULT_CATALOG ='));
