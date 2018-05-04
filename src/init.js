/*
    运行'theme init'初始化项目
    1.检测kuma-base包是否安装
    2.导入配置文件theme.config.json
*/
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const { npmInstall, readFile, writeFile, existsFile, mkdir, getDefaultPageFileName, getAllPage, removeFile } = require('./utils');

const cwd = process.cwd();

const configRoot = path.join(__dirname, '../');

let themes = null;

const checkConfigJson = () => {
  console.log('checkConfigJson');
  return existsFile(`${cwd}/theme.config.json`);
}

const getConfigJson = () => {
  const localThemes = readFile(`${cwd}/theme.config.json`);
  return JSON.parse(localThemes);
}

const createConfigJson = () => {
  themes = readFile(`${configRoot}/theme.config.json`);
  themes = JSON.parse(themes);
  console.log(`Creating file: ${configRoot}/theme.config.json`);
  writeFile(`${cwd}/theme.config.json`, JSON.stringify(themes, null, 4))
}

const createDefaultThemeTemp = () => {
  const file = readFile(`${configRoot}/templete/colors.ejs`);
  const themeFile = path.join(cwd, './src/theme');

  if (!existsFile(themeFile)) {
    mkdir(themeFile)
  }

  console.log(`Creating file: ${themeFile}/colors.ejs`);
  writeFile(`${themeFile}/colors.ejs`, file.toString());
}

const checkDependent = () => {
  let pkg = readFile(`${cwd}/package.json`);
  pkg = JSON.parse(pkg);
  const { dependencies } = pkg;
  if (!dependencies['kuma-base']) {
    console.log('Installing: kuma-base');
    npmInstall('tnpm', 'kuma-base', cwd);
  }

}

const init = (pages, all) => {
  console.log('Runing theme init...');
  checkDependent();
  createConfigJson();
  createDefaultThemeTemp();
}

module.exports = {
  init,
  getConfigJson
};


