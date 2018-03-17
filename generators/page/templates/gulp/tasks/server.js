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

  watch('./src/templates/**/*.{html,svg}', () => { runSequence('templates'); });

  // Ignore Chrome's temp file from the glob below, as developers tend to download
  // images straight from Chrome to this folder.
  watch(['./src/images/**/*', '!**/*.crdownload'], () => { runSequence('img'); });
};
