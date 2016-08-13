'use strict';
var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	merge = require('merge-stream');

module.exports = function() {
  // Compile bundled SCSS
  var bundled = gulp.src('./build/static/sass/**/+*.sass')
    .pipe(sass({indentedSyntax: true}).on('error', sass.logError))
    .pipe(rename({extname: '.sass.css'}))
    .pipe(gulp.dest('./build/static/css/common'));
  // Compile non-bundled SCSS
  var copied = gulp.src(['./build/static/sass/**/*.sass','!./build/static/sass/**/+*.sass'])
    .pipe(sass({indentedSyntax: true}).on('error', sass.logError))
    .pipe(rename({extname: '.sass.css'}))
    .pipe(gulp.dest('./build/static/css'));

  return merge(bundled, copied);
};