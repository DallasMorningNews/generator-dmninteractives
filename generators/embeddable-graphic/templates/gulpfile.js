'use strict';

const gulp = require('./gulp')([
  'sass',
  'browserify',
  'watchify',
  'server',
  'aws',
]);
const runSequence = require('run-sequence');


gulp.task('build', ['sass', 'browserify']);
gulp.task('publish', (cb) => { runSequence('build', 'aws', cb); });
gulp.task('default', ['sass', 'watchify', 'server']);
