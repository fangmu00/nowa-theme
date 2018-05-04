/*
* @Author: sunguo
* @Date:   2016-04-21 17:34:00
* @Last Modified by:   sunguo
* @Last Modified time: 2016-04-21 20:23:36
*/

'use strict';

var pkg = require('../package.json');
var { init } = require('./init');
var build = require('./build');
var { server } = require('./server');

module.exports = {

  command: 'theme <type>',

  description: pkg.description,

  action: function(type) {

    switch (type) {
      case 'init':
        init();
        break;

      case 'server':
        server();
        break;

      case 'build':
        build();
        break;

      default:
        break;
    }
  }
};
