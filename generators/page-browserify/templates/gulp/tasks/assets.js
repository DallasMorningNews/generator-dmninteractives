/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const gulp = require('gulp');


module.exports = () =>
    gulp.src('./src/assets/**/*')
      .pipe(gulp.dest('./dist/assets'));
