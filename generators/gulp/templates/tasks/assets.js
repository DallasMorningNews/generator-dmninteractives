'use strict';
var gulp = require('gulp');

module.exports = function() {
	var assets = gulp.src('./build/static/assets/**/*')
    	.pipe(gulp.dest('./public/assets'));
  	return assets;
};