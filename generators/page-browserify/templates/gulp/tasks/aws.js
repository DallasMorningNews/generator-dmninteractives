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
const publisher = awspublish.create(awsJson);
const year = meta.publishYear;


const awsDirectory = `${year}/${appName}/`;


module.exports = () =>
    gulp.src('./dist/**/*')
        .pipe(confirm({
          question: deline`You're about to publish this project to AWS
                            under the directory '${awsDirectory}'.
                            In the process, we'll also wipe out any
                            uploads to the test directory.
                            Are you sure you want to do this?`,
          input: '_key:y',
        }))
        .pipe(rename((filePath) => {
          // eslint-disable-next-line no-param-reassign
          filePath.dirname = awsDirectory + filePath.dirname.replace('.\\', '');
        }))
        .pipe(publisher.publish({}, { force: false }))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter())
        .on(
          'end',
          gutil.log.bind(
            gutil,
            // eslint-disable-next-line comma-dangle
            `Published at 'http://interactives.dallasnews.com/${awsDirectory}'.`
          )  // eslint-disable-line comma-dangle
        );
