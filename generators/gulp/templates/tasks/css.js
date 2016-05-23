'use strict';
var gulp = require('gulp'),
	concat = require('gulp-concat'),
	merge = require('merge-stream');

module.exports = function() {
  // Copy bundled CSS
  var bundled = gulp.src('./build/static/css/**/+*.css')
    .pipe(concat('styles-bundle.css'))
    .pipe(gulp.dest('./public/css'));
  // Copy non-bundled CSS
  var copied = gulp.src(['./build/static/css/**/*.css','!./build/static/css/**/+*.css'])
    .pipe(gulp.dest('./public/css'));

  return merge(bundled, copied);
};