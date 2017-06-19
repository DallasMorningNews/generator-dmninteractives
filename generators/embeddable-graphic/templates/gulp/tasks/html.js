/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const gulp = require('gulp');


module.exports = () =>
    gulp.src('./src/*.html')
      .pipe(gulp.dest('./dist/'));
