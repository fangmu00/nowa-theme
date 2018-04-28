const spawn = require('child_process').spawn;
const fs = require('fs');
const rimraf = require('rimraf');

const getNpmRegistry = (npm) => {
  switch (npm) {
    case 'npm':
      return {
        cmd: 'npm',
        registry: 'https://registry.npmjs.org'
      };
    case 'cnpm':
      return {
        cmd: 'cnpm',
        registry: 'https://registry.npm.taobao.org'
      };
    case 'tnpm':
      return {
        cmd: 'tnpm',
        registry: 'http://registry.npm.alibaba-inc.com'
      };
    default:
      return {
        cmd: 'npm',
        registry: npm
      };
  }
}

// call npm install
const npmInstall = (npm, name, root) => {
  var npmRegistry = getNpmRegistry(npm);
  spawn(process.platform === 'win32' ? npmRegistry.cmd + '.cmd' : npmRegistry.cmd, [
    'install',
    name,
    '--save',
    '--registry=' + npmRegistry.registry
  ], {
    cwd: root,
    stdio: 'inherit',
    stderr: 'inherit'
  }).on('exit', function(code) {
  });
}

const readFile = (filepath) => {
  try {
    return fs.readFileSync(filepath);
  } catch (error) {
    console.log(error.message);
    process.exit(0);
  }
}

const writeFile = (filepath, data) => {
  try {
    fs.writeFileSync(filepath, data);
  } catch (error) {
    console.log(error.message);
    process.exit(0);
  }
}

const existsFile = filepath => fs.existsSync(filepath);

const mkdir = (filepath) => fs.mkdirSync(filepath);

const getDefaultPageFileName = (name) => {
  const arr = name.split('-');
  let newName = 'Page';
  const reg = /\b(\w)|\s(\w)/g;
  arr.forEach((item) => {
    newName += item.replace(reg, m => m.toUpperCase());
  });
  return newName;
}

const getAllPage = (filepath) => {
  const pages = [];
  fs.readdirSync(filepath).forEach((page) => {
    pages.push(page);
  });
  return pages;
}
const removeFile = (filepath) => {
  rimraf.sync(filepath);
}

module.exports = {
  getNpmRegistry,
  npmInstall,
  readFile,
  writeFile,
  existsFile,
  mkdir,
  getDefaultPageFileName,
  getAllPage,
  removeFile,
}



