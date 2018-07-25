'use strict';

const autoprefixer = require('autoprefixer');
const eyeglass = require('eyeglass');
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


module.exports = () =>
    gulp.src('src/sass/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass(eyeglass({ outputStyle: 'compressed' })).on('error', sass.logError))
      .pipe(postcss([autoprefixer({ grid: true })]))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css'));
