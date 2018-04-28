/*
    运行'theme start'生成样式文件
*/
const fs = require('fs');
const path = require('path');
const os = require('os');

const appPath = path.join(process.cwd(), './src/app');
const pagesPath = path.join(process.cwd(), './src/pages');
