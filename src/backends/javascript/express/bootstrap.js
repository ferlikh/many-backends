var fs = require('fs');
var path = require('path');

const BASE_DIR = path.resolve(__dirname + '/../../../..');
const FRONTEND_DIR = path.join(BASE_DIR, '/src/frontend');

// replace relative paths
const envPath = path.join(`${BASE_DIR}`, '.env');
fs.open(envPath, (err, fd) => {
    if(err) throw err;
    const source = fs.readFileSync(fd).toString();
    const formatted = source
        .replace('BASE_DIR=.', 'BASE_DIR=' + BASE_DIR)
        .replace('FRONTEND_DIR=src/frontend', 'FRONTEND_DIR=' + FRONTEND_DIR);

    fs.writeFileSync(envPath, formatted);

    fs.close(fd);
});