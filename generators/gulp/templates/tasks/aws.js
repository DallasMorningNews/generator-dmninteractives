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
  var year = meta.publishYear,
      publisher = awspublish.create(awsJson);

  return gulp.src('./public/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory \''+year+'/'+appName+'\'. In the process, we\'ll also wipe out any uploads to the test directory. Are you sure you want to do this?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/'+year+'/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:false}))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
};