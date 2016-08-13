'use strict';
var gulp = require('gulp'),
	batch = require('gulp-batch'),
	watch = require('gulp-watch');

module.exports = function() {
    watch([
      './build/static/images/**/*',
      '!./build/static/images/opt/**/*',
      '!**/*.crdownload' // Ignore chrome's temp file
      ], batch(function (events, done) {
        gulp.start('img', done);
    }));
};
