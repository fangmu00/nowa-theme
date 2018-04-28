# nowa-theme

[![NPM version](https://img.shields.io/npm/v/nowa-theme.svg?style=flat)](https://npmjs.org/package/nowa-theme)

基于kuma-base增强nowa多主题方案

---

## Feature

- 多主题配置

## Install

```bash
$ npm i nowa -g
$ nowa install theme
```

## Usage

![usage](./images/a.gif)

1. 新建项目、新建页面如page1、page2
```bash
$ nowa init uxcore
$ nowa init page
```
2. 生成多主题样式文件（可指定page、或全局设置）,根目录生成theme.config.json,入口js文件自动替换默认主题less文件
```bash
$ nowa theme --page page1,page2
or
$ nowa theme --all
```

### theme.config.json 配置
```javascript
[
    {
      "theme": "orange", 
      "default": true
    },
    {
      "theme": "alipay"
    },
    {
      "theme": "green"
    }
  ]

```

### 主题变量less文件 theme-xxx.less 内容
```javascript
@import '~kuma-base/theme/xxx.less'; 
@import '../PageXxxx.less'; // page less入口
```

### 其他主题入口js theme-xxx.js 内容
```javascript
import './theme-xxx.less';
```

### 部署
todo....
