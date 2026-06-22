const fs = require('fs');
const path = require('path');

const coreStyles = path.resolve(__dirname, '../../js/src/styles.css');
const dest = path.resolve(__dirname, '../dist/styles.css');

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(coreStyles, dest);
console.log('Copied styles.css to dist/styles.css');
