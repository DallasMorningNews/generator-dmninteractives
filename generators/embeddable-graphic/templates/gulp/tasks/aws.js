'use strict';

const confirm = require('gulp-confirm');
const rename = require('gulp-rename');
const awspublish = require('gulp-awspublish');
const cloudfront = require('gulp-cloudfront-invalidate-aws-publish');
const gulp = require('gulp');

const awsJson = require('../../aws.json');
const meta = require('../../meta.json');

const cfSettings = {
  distribution: 'E3QK9W6AW5LAVH',
  accessKeyId: awsJson.accessKeyId,
  secretAccessKey: awsJson.secretAccessKey,
  wait: false,
};


module.exports = () => {
  const publisher = awspublish.create(awsJson);
  const awsDirectory = `embeds/${meta.publishYear}/${meta.name}/`;

  return gulp.src('./dist/**/*')
    .pipe(confirm({
      question: `You're about to publish this project to AWS under directory ${awsDirectory}. Are you sure you want to do this?`,
      input: '_key:y'
    }))
    .pipe(rename((path) => {
      path.dirname = awsDirectory + path.dirname.replace('.\\','');
    }))
    .pipe(publisher.publish({}, { force: false }))
    .pipe(publisher.cache())
    .pipe(cloudfront(cfSettings))
    .pipe(awspublish.reporter());
};
