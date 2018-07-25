/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const autoprefixer = require('autoprefixer');
const eyeglass = require('eyeglass');
const gulp = require('gulp');
const rename = require('gulp-rename');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


module.exports = () =>
    gulp.src(['./src/scss/**/*.scss', './src/scss/**/*.css'])
      .pipe(sourcemaps.init())
      .pipe(sass(eyeglass({ outputStyle: 'compressed' })).on('error', sass.logError))
      .pipe(postcss([autoprefixer({ grid: true })]))
      // eslint-disable-next-line no-param-reassign
      .pipe(rename((filePath) => { filePath.basename += '-bundle'; }))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
