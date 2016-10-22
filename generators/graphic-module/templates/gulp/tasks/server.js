const browserSync = require('browser-sync').create();
const gulp = require('gulp');

module.exports = () => {
  browserSync.init({
    files: ['./dist/**/*'],
    server: {
      baseDir: './dist/',
    },
    ghostMode: false,
  });

  gulp.watch(['./src/scss/**/*.scss'], ['sass']);
};
