'use strict';
var gulp = require('gulp'),
	jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    merge = require('merge-stream');

module.exports = function() {
  // Copy data assets
  var data = gulp.src('./build/static/js/**/*.json')
    .pipe(gulp.dest('./public/js'));
  // Copy bundled scripts
  var bundled = gulp.src('./build/static/js/**/+*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(sourcemaps.init())
    .pipe(concat('scripts-bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));
  // Copy non-bundled scripts
  var copied = gulp.src(['./build/static/js/**/*.js','!./build/static/js/**/+*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));

  return merge(data, bundled, copied);
};