const spawn = require('child_process').spawn;
const fs = require('fs');
const rimraf = require('rimraf');
const path = require('path');

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
  const npmRegistry = getNpmRegistry(npm);
  spawn(process.platform === 'win32' ? npmRegistry.cmd + '.cmd' : npmRegistry.cmd, [
    'install',
    name,
    '--save',
    '--registry=' + npmRegistry.registry
  ], {
      cwd: root,
      stdio: 'inherit',
      stderr: 'inherit'
    }).on('exit', function (code) {
    });
}

const readFile = (filepath) => {
  try {
    return fs.readFileSync(filepath);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

const writeFile = (filepath, data) => {
  try {
    fs.writeFileSync(filepath, data);
  } catch (error) {
    console.log(error.message);
    process.exit(1);
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
};

const getAllPage = (filepath) => {
  const pages = [];
  fs.readdirSync(filepath).forEach((page) => {
    pages.push(page);
  });
  return pages;
};

const removeFile = (filepath) => {
  rimraf.sync(filepath);
};

const renameFile = (oldPath, newPath) => {
  fs.renameSync(oldPath, newPath);
}

const copyFile = (srcPath, tarPath) => {
  const rs = fs.createReadStream(srcPath);
  const ws = fs.createWriteStream(tarPath);
  rs.pipe(ws);
  return new Promise((resolve, reject) => {
    rs.on('error', (err) => {
      if (err) {
        console.log('read error', srcPath, err);
      }
      reject(err);
    });

    ws.on('error', (err) => {
      if (err) {
        console.log('write error', tarPath, err);
      }
      reject(err);
    });

    ws.on('error', (err) => {
      if (err) {
        console.log('write error', tarPath, err);
      }
      reject(err);
    });

     ws.on('close', () => {
      resolve();
     })
  })

}

const copyFolder = (srcDir, tarDir, arr = []) => {
  return new Promise((resolve, reject) => {
    fs.readdir(srcDir, function (err, files) {

      if (err) {
        reject(err)
      }

      files.forEach(function (file) {
        const srcPath = path.join(srcDir, file)
        const tarPath = path.join(tarDir, file)
        arr.push(new Promise((resolve, reject) => {
          fs.stat(srcPath, function (err, stats) {
            if (stats.isDirectory()) {
              console.log('Mkdir file:', tarPath)
              fs.mkdir(tarPath, function (err) {
                if (err) {
                  reject(err);
                }

                return copyFolder(srcPath, tarPath);
              })
            } else {
              console.log(`Copy file: ${srcPath}`);
              copyFile(srcPath, tarPath)
                .then(() => {
                  resolve();
                })
                .catch((err) => {
                  reject(err)
                });
            }
          })
        }))

      })
      return Promise.all(arr)
              .then(() => {
                resolve()
              })
              .catch((err) => {
                reject(err)
              });
    })
  });

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
  renameFile,
  copyFolder,
  copyFile,
}



