/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const changed = require('gulp-changed');
const gulp = require('gulp');
const merge = require('merge-stream');


module.exports = () => {
  // Copies over SVGs or other image files
  const other = gulp.src([
    './src/images/**/*',
    '!./src/images/**/*.{png,jpg,JPG}',
    '!./src/images/opt/**/*',
  ],{ nodir: true })
    .pipe(changed('./dist/images'))
    .pipe(gulp.dest('./dist/images'));

  // Copy imgs that weren't resized
  const copied = gulp.src('./src/images/opt/**/_*.{png,jpg,JPG}')
    .pipe(changed('./dist/images'))
    .pipe(gulp.dest('./dist/images'));

  return merge(other, copied);
};
