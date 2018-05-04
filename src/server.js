/*
    启动服务
    1.获取配置文件theme.config.json
    2.替换项目src目录下的thme文件夹下的ejs文件
    3.nowa server
*/
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const { spawn } = require('child_process');

const { getConfigJson } = require('./init');
const { writeFile, readFile } = require('./utils');

const cwd = process.cwd();
const themeRoot = path.join(cwd, './src/theme');

const getDefaultThemes = () => {
  const config = getConfigJson();
  const { theme } = config;
  let defaultTheme = theme.find(item => item.default);
  return defaultTheme = defaultTheme ? defaultTheme : theme[0];
}

const parseLess = (theme, fileName, root) => {
  console.log(`Transforming file: ${root}/${fileName}.ejs`);

  const strLess = readFile(`${root}/${fileName}.ejs`);
  const templateLess = ejs.compile(strLess.toString());

  console.log(`Creating file: ${root}/${fileName}.less`);

  writeFile(`${root}/${fileName}.less`, templateLess({ theme }));
}

const transformTemp = (root, theme) => {
  fs.readdirSync(root).forEach((file) => {
    const filePath = path.join(root, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      transformTemp(filePath, theme);
    } else {
      const extPos = file.lastIndexOf('.');
      const name = file.slice(0, extPos);
      const type = file.slice(extPos + 1);

      if (type === 'ejs') {
        parseLess(theme, name, root);
      }
    }
  });
}

const run = () => {
  console.log('\nRuning server...');
  nowa = spawn('nowa', ['server'], {
    cwd,
    stdio: 'inherit',
    stderr: 'inherit'
  });
}

module.exports = {
  server: () => {
    const defaultTheme = getDefaultThemes();

    console.log('\nTransforming theme file...\n');

    transformTemp(themeRoot, defaultTheme);

    run();
  },
  getDefaultThemes,
  parseLess,
  transformTemp,
  themeRoot,

}

