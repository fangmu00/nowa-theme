/*
    启动服务
    1.获取配置文件theme.config.json
    2.遍历配置文件对象，打包到对应主题out文件夹
*/
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { spawn } = require('child_process');

const { getConfigJson } = require('./init');
const { getDefaultThemes, transformTemp, themeRoot } = require('./server');
const { writeFile, copyFolder, removeFile, existsFile, renameFile, mkdir, copyFile } = require('./utils');

const cwd = process.cwd();
const distPath = path.join(cwd, './dist');
const distThemePath = path.join(cwd, './__theme__dist__');

const copyDist = (newFile, cb) => { // 将dist目录下的文件复制到构建主题目录下

  const tarPath = path.join(distThemePath, `./${newFile}`);
  if (!existsFile(distThemePath)) {
    mkdir(distThemePath);
  }
  if (!existsFile(tarPath)) {
    mkdir(tarPath);
  } else {
    removeFile(tarPath);
    mkdir(tarPath);
  }

  console.log('Copying files...\n');

  copyFolder(distPath, tarPath).then((content) => {
    cb && cb();
  }).catch((err) => {
    console.log(err)
  })

}
const run = (index, themes) => {
  if (!themes[index]) {
    removeFile(distPath);
    renameFile(distThemePath, distPath);
    console.log('Build success!');
    process.exit(0);
  }

  transformTemp(themeRoot, themes[index]);

  console.log(`\nRunning build ${themes[index].name}...\n`);

  const build = spawn('nowa', ['build'], {
    cwd,
    stdio: 'inherit',
    stderr: 'inherit'
  });

  build.on('close', (code) => {
    if (code !== 0) {

      process.exit(1);
    } else {
      copyDist(themes[index].name, () => {
        run(index + 1, themes);
      });
    }
  });

}

module.exports = () => {
  console.log('\nTransforming theme file...\n');

  const config = getConfigJson();
  const { theme } = config;

  removeFile(distPath);

  run(0, theme);
}

