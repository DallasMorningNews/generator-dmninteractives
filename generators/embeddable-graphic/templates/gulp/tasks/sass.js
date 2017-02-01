'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


module.exports = () =>
    gulp.src('src/sass/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest('dist/css'));
