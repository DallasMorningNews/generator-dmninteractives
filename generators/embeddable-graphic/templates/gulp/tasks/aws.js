'use strict';

const confirm = require('gulp-confirm');
const rename = require('gulp-rename');
const awspublish = require('gulp-awspublish');
const awspublishRouter = require("gulp-awspublish-router");
const cloudfront = require('gulp-cloudfront-invalidate-aws-publish');
const gulp = require('gulp');

const awsJson = require('../../aws.json');
const meta = require('../../meta.json');

const cfSettings = {
  distribution: 'E3QK9W6AW5LAVH',
  accessKeyId: awsJson.accessKeyId,
  secretAccessKey: awsJson.secretAccessKey,
  wait: false,
  indexRootPath: true,
};

const oneDayInMS = 60 * 60 * 24;

const routes = {
  routes: {
    // Cache video and audio for 1 week on user's computer, one month in CloudFront
    '^.*\\.(aif|iff|m3u|m4a|mid|mp3|mpa|ra|wav|wma|3g2|3gp|asf|asx|avi|flv|mov|mp4|mpg|rm|swf|vob|wmv)': {
      cacheTime: oneDayInMS * 7,
      sharedCacheTime: oneDayInMS * 30,
    },
    // Cache images 2 days on user's computer, one month in CloudFront
    '^.*\\.(jpg|jpeg|svg|bmp|png|tiff|gif)': {
      cacheTime: oneDayInMS * 2,
      sharedCacheTime: oneDayInMS * 30,
    },
    // Cache images 5 minutes on user's computer, one month in CloudFront
    '^.*\\.(html|js|css)': {
      cacheTime: 60 * 5,
      sharedCacheTime: oneDayInMS,
    },
    // Catch everything else in an empty route, or we'll get errors
    '.*': {},
  },
};

module.exports = () => {
  const publisher = awspublish.create(awsJson);
  const awsDirectory = `embeds/${meta.publishYear}/${meta.name}/`;

  return gulp.src('./dist/**/*')
    .pipe(confirm({
      question: `You're about to publish this project to AWS under directory ${
        awsDirectory
      }. Are you sure you want to do this?`,
      input: '_key:y',
    }))
    .pipe(rename((path) => {
      // eslint-disable-next-line no-param-reassign
      path.dirname = awsDirectory + path.dirname.replace('.\\', '');
    }))
    .pipe(awspublishRouter(routes))
    .pipe(publisher.publish({}, { force: false }))
    .pipe(cloudfront(cfSettings))
    .pipe(publisher.cache())
    .pipe(awspublish.reporter());
};
