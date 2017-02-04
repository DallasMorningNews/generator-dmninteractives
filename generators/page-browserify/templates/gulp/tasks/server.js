const batch = require('gulp-batch');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const watch = require('gulp-watch');


module.exports = () => {
  browserSync.init({
    files: ['./dist/**/*'],
    server: {
      baseDir: './dist/',
    },
    ghostMode: false,
  });

  watch('./src/static/assets/**/*', 'assets');

  watch('./src/static/scss/**/*.scss', 'scss');

  watch(
    './src/templates/**/*.html',
    batch((e, cb) => {
      console.log('Template refresh.');

      if (typeof cb === 'undefined') {
        //
      }
      // gulp.start('templates', cb)
    })  // eslint-disable-line comma-dangle
  );
  watch(
    [
      './src/static/images/**/*',
      '!./src/static/images/opt/**/*',
      '!**/*.crdownload', // Ignore chrome's temp file
    ],
    batch((e, cb) => { gulp.start('img', cb); })  // eslint-disable-line comma-dangle
  );
};
