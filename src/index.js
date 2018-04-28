/*
* @Author: sunguo
* @Date:   2016-04-21 17:34:00
* @Last Modified by:   sunguo
* @Last Modified time: 2016-04-21 20:23:36
*/

'use strict';

var pkg = require('../package.json');
var init = require('./init');
var build = require('./build');

function list(val) {
  return val.split(',');
}

module.exports = {

  command: 'theme',

  description: pkg.description,

  options: [
   [ '-p, --page <page>', 'which page to set theme', list],
   [ '-a, --all', 'set theme all page']
  ],

  action: function(commond) {
    const pages = commond.page ? commond.page : [];
    const all = !!commond.all;
    init(pages, all);
  }
};
