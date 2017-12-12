/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const autoprefixer = require('autoprefixer');
const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


module.exports = () =>
    gulp.src(['./src/scss/**/*.scss', './src/scss/**/*.css'])
      // eslint-disable-next-line no-param-reassign
      .pipe(rename((filePath) => { filePath.basename += '-bundle'; }))
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(postcss([autoprefixer()]))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
