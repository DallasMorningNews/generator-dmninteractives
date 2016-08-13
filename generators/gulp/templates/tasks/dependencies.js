'use strict';
var gulp = require('gulp'),
	mainBowerFiles = require('main-bower-files'),
	sourcemaps = require('gulp-sourcemaps'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	merge = require('merge-stream');

module.exports = function() {
  var js = gulp.src(mainBowerFiles('/**/*.js'))
    .pipe(sourcemaps.init())
    .pipe(concat('dependency-bundle.js')) // Bundle JS
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));

  var css = gulp.src(mainBowerFiles('/**/*.css'))
    .pipe(sourcemaps.init())
    .pipe(concat('dependency-bundle.css')) // Bundle CSS
    .pipe(minifyCss({ keepSpecialComments : 0, processImport: false })) // Don't keep CSS comments or process import statements like google fonts
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'));

  return merge(css, js);
};