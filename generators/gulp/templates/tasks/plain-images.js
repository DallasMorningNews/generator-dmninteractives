'use strict';
var gulp = require('gulp'),
	changed = require('gulp-changed'),
	merge = require('merge-stream');

module.exports = function() {
	// Copies over SVGs or other image files
	var other = gulp.src([
	  './build/static/images/**/*',
	  '!./build/static/images/**/*.{png,jpg,JPG}',
	  '!./build/static/images/opt/**/*'
	],{ nodir: true })
	.pipe(changed('./public/images'))
	.pipe(gulp.dest('./public/images'));
	// Copy imgs that weren't resized
	var copied = gulp.src('./build/static/images/opt/**/_*.{png,jpg,JPG}')
	.pipe(changed('./public/images'))
	.pipe(gulp.dest('./public/images'));

	return merge(other, copied);
};