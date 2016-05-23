'use strict';
var gulp = require('gulp'),
	confirm = require('gulp-confirm'),
	rename = require('gulp-rename'),
	path = require('path'),
	awspublish = require('gulp-awspublish'),
  S = require('string');

var awsJson = require('./../../aws.json'),
    meta = require('./../../meta.json'),
    appName = S(meta.name).slugify().s;

module.exports = function() {
  var publisher = awspublish.create(awsJson);
  return gulp.src('./public/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory test/\''+appName+'\'. Are you sure?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/test/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:false}))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
};