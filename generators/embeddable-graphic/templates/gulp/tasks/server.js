'use strict';

const browserSync = require('browser-sync').create();
const gulp = require('gulp');

module.exports = () => {
  browserSync.init({
    files: ['./dist/**/*'],
    server: {
      baseDir: './dist/',
      index: 'embed.html',
    },
    ghostMode: false,
  });

  gulp.watch(['./src/sass/*.scss'], ['sass']);
  gulp.watch(['./src/data/**/*'], ['data']);
  gulp.watch(['./src/*.html'], ['html']);
};
