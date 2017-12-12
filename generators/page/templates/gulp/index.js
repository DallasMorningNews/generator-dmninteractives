/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const gulp = require('gulp');

module.exports = (tasks) => {
  tasks.forEach((name) => {
    gulp.task(name, require(`./tasks/${name}`)); // eslint-disable-line global-require
  });

  return gulp;
};
