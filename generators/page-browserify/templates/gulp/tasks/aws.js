const awsJson = require('./../../aws.json');
const awspublish = require('gulp-awspublish');
const confirm = require('gulp-confirm');
const deline = require('deline');
const gulp = require('gulp');
const meta = require('./../../meta.json');
const path = require('path');
const rename = require('gulp-rename');
const S = require('string');


const appName = S(meta.name).slugify().s;
const publisher = awspublish.create(awsJson);
const year = meta.publishYear;


module.exports = () =>
    gulp.src('./public/**/*')
        .pipe(confirm({
          question: deline`You're about to publish this project to AWS
                            under the directory '${year}/${appName}'.
                            In the process, we'll also wipe out any
                            uploads to the test directory.
                            Are you sure you want to do this?`,
          input: '_key:y'
        }))
        .pipe(rename(function (path) {
            path.dirname = `/${year}/${appName}/${path.dirname.replace('.\\','')}`;
        }))
        .pipe(publisher.publish({},{force:false}))
        .pipe(publisher.cache())
        .pipe(awspublish.reporter());
