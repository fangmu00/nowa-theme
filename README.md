# nowa-theme

[![NPM version](https://img.shields.io/npm/v/nowa-theme.svg?style=flat)](https://npmjs.org/package/nowa-theme)

基于kuma-base增强nowa多主题方案。

---

## Feature

- 多主题配置
- 无需引入多个主题less文件

## Install

```bash
$ npm i nowa -g
$ nowa install theme
```

## Usage

1. 新建项目
```bash
$ nowa init uxcore
```
2. 生成theme.config.json主题配置文件、less模板文件
```bash
$ nowa theme init
```
3. 在需要的地方引入less文件

4. 启动服务
```bash
$ nowa theme server
```
5. 部署生成多主题文件目录
```bash
$ nowa theme build
```

### theme.config.json 配置
```javascript
{
  "theme": [
    {
      "name": "orange", // 主题名称
      "default": true, // 默认主题
      "logo": "orange.jpg" // logo url地址
      ... // 配置其他自定义字段
    },
    {
      "name": "alipay",
      "logo": "xxx.jpg"
    },
    {
      "name": "green",
      "logo": "xxx.jpg"
    }
    ...// 自行添加其他主题
  ]
}
```

### 默认less模板文件 colors.ejs 内容
```less
@import '~kuma-base/theme/<%= theme.name %>.less';
@brand-logo: <%= theme.logo %>;
// 可根据theme.config.json添加的自定义字段、添加逻辑代码, 也可新建多个模板文件。
```
工具会将其转化为对应的less文件，在你需要它们的时候引入即可。
```less
@import '../theme/colors.less';
.a {
  font-size: 14px;
  color: #333;
  background-color: @brand-primary;
}
.logo {
  background: url(@brand-logo);
}
```

