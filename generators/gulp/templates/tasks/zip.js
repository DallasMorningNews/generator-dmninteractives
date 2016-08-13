'use strict';
var gulp = require('gulp'),
	S = require('string'),
	zip = require('gulp-zip');

var meta = require('./../../meta.json'),
    appName = S(meta.name).slugify().s;

module.exports = function() {
  return gulp.src([
  		'./**/*','./.*','!aws.json',
  		'!node_modules/**/*','!.git/*',
  		'!./**/*.zip','!./build/static/vendor/**/*'
  	]) // Zip everything except aws credentials, node modules, bower components, git files and zip files
      .pipe(zip(appName + '.zip'))
      .pipe(gulp.dest('public'));
};
