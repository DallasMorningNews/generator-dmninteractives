'use strict';

const gulp = require('./gulp')([
  'sass',
  'browserify',
  'watchify',
  'server',
  'aws',
  'html',
  'data',
]);
const runSequence = require('run-sequence');


gulp.task('build', ['data', 'html', 'sass', 'browserify']);
gulp.task('publish', (cb) => { runSequence('build', 'aws', cb); });
gulp.task('default', ['sass', 'watchify', 'server']);
