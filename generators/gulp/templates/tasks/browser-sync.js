'use strict';
var browserSync = require('browser-sync');

module.exports = function() {
	browserSync.init({
      files: ['./public/**/*'],
      server: {
          baseDir: './public/'
      },
      ghostMode: false
  });
};