/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const batch = require('gulp-batch');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');


module.exports = () => {
  browserSync.init({
    files: ['./dist/**/*'],
    server: {
      baseDir: './dist/',
    },
    ghostMode: false,
  });

  watch('./src/data/**/*', () => { runSequence('assets'); });

  watch('./src/scss/**/*.scss', () => { runSequence('scss'); });

  watch('./src/templates/**/*.html', () => { runSequence('templates'); });

  watch(
    [
      './src/images/**/*',
      '!./src/images/opt/**/*',
      '!**/*.crdownload', // Ignore chrome's temp file
    ],
    () => { runSequence('img'); }  // eslint-disable-line comma-dangle
    // batch((e, cb) => { gulp.start('img', cb); })
  );
};
