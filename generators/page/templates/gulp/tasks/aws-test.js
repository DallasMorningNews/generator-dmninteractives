/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const awspublish = require('gulp-awspublish');
const confirm = require('gulp-confirm');
const deline = require('deline');
const gulp = require('gulp');
const gutil = require('gulp-util');
const path = require('path');
const rename = require('gulp-rename');
const S = require('string');


const awsJson = require('./../../aws.json');
const meta = require('./../../meta.json');


const appName = S(meta.name).slugify().s;

const awsDirectory = `test/${appName}/`;


module.exports = () => {
  const publisher = awspublish.create(awsJson);

  return gulp.src('./dist/**/*')
      .pipe(confirm({
        question: deline`You're about to publish this project to AWS
                        under the directory '${awsDirectory}'.
                        Are you sure you want to do this?`,
        input: '_key:y',
      }))
      .pipe(rename((filePath) => {
        // eslint-disable-next-line no-param-reassign
        filePath.dirname = awsDirectory + filePath.dirname.replace('.\\', '');
      }))
      .pipe(publisher.publish({}, { force: false }))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
};
