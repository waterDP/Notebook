const fs = require('fs');

fs.readFile('./readdir.js', (err, buf) => console.log(buf.toString()));