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
  return existsFile(`${cwd}/theme.config.json`);
}

const getConfigJson = () => {
  const localThemes = readFile(`${cwd}/theme.config.json`);
  return JSON.parse(localThemes);
}

const makeConfigJson = () => {
  if (!checkConfigJson()) {
    themes = readFile(`${configRoot}/theme.config.json`);
    themes = JSON.parse(themes);
    writeFile(`${cwd}/theme.config.json`, JSON.stringify(themes, null, 4))
  } else {
    themes = getConfigJson();
  }
}

const replaceImportDefaultLess = (filePath, pageName, fileName, themeFileName) => {

  try {
    let str = readFile(filePath).toString();
    if (str.indexOf(`./${fileName}.less`) !== -1) {
      str = str.replace(`./${fileName}.less`, `./theme/${themeFileName}.less`);
    } else {
      themes.forEach((item) => {
        const f = `./theme/theme-${item.theme}.less`
        if (str.indexOf(f) !== -1) {
          str = str.replace(f, `./theme/${themeFileName}.less`);
        }
      })
    }
    writeFile(filePath, str);
  } catch (error) {
    console.log(`Warning, page: ${pageName} executing failed`)
  }
}

const makeAppTheme = () => {
  const appPath = path.join(cwd, './src/app/');
  const appThemePath = path.join(appPath, './theme');
  if (!existsFile(appThemePath)) {
    mkdir(appThemePath);
  } else {
    removeFile(appThemePath);
    mkdir(appThemePath);
  }
  console.log(`Executing app....`);
  themes.forEach((item) => {
    const strLess = readFile(`${configRoot}/templete/theme-less.ejs`);
    const strJs = readFile(`${configRoot}/templete/theme-js.ejs`);
    const templateLess = ejs.compile(strLess.toString());
    const templateJs = ejs.compile(strJs.toString());
    const { theme } = item;

    writeFile(`${appThemePath}/theme-${theme}.less`, templateLess({ color: item, index: '../app.less' }));
    if (!item.default) {
      writeFile(`${appThemePath}/theme-${theme}.js`, templateJs({ color: item }));
    } else {
      replaceImportDefaultLess(`${appPath}/app.js`, 'app', 'app', `theme-${theme}`, );
    }

  });
}

const makePageTheme = (pages) => {
  pages.forEach((page) => {
    const pagePath = path.join(cwd, `./src/pages/${page}`);
    const pageThemePath = path.join(pagePath, './theme');
    if (!existsFile(pageThemePath)) {
      mkdir(pageThemePath)
    } else {
      removeFile(pageThemePath);
      mkdir(pageThemePath);
    }
    console.log(`Executing page:${page}....`);
    themes.forEach((item) => {
      const strLess = readFile(`${configRoot}/templete/theme-less.ejs`);
      const strJs = readFile(`${configRoot}/templete/theme-js.ejs`);
      const templateLess = ejs.compile(strLess.toString());
      const templateJs = ejs.compile(strJs.toString());
      const { theme } = item;
      const fileName = getDefaultPageFileName(page);
      const themeFileName = `theme-${theme}`;
      writeFile(`${pageThemePath}/${themeFileName}.less`, templateLess({ color: item, index: `../${fileName}.less` }));
      if (!item.default) {
        writeFile(`${pageThemePath}/${themeFileName}.js`, templateJs({ color: item }));
      } else {
        replaceImportDefaultLess(`${pagePath}/${fileName}.jsx`, page, fileName, themeFileName );
      }
    });
  });
}

const checkDependent = () => {
  let pkg = readFile(`${cwd}/package.json`);
  pkg = JSON.parse(pkg);
  const { dependencies } = pkg;
  if (!dependencies['kuma-base']) {
    npmInstall('tnpm', 'kuma-base',  cwd);
  }

}

const init = (pages, all) => {
  checkDependent();
  makeConfigJson();
  makeAppTheme();
  if (all) {
    makePageTheme(getAllPage(path.join(cwd, './src/pages')));
  } else if (pages.length){
    makePageTheme(pages)
  }
  console.log(`transfer success!`);
}

module.exports = init;


