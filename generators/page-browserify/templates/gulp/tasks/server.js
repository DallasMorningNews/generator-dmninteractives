const batch = require('gulp-batch');
const browserSync = require('browser-sync').create();
const gulp = require('gulp');
const watch = require('gulp-watch');

module.exports = () => {
  browserSync.init({
    files: ['./public/**/*'],
    server: {
      baseDir: './public/',
    },
    ghostMode: false,
  });

  watch(
    './build/static/assets/**/*',
    batch((e, cb) => { gulp.start('assets', cb)})
  );
  watch(
    './build/static/scss/**/*.scss',
    batch((e, cb) => { gulp.start('scss', cb)})
  );
  watch(
    './build/static/js/**/*.js*',
    batch((e, cb) => {
      console.log('JS refresh.');
      // gulp.start('js', cb)
    })
  );
  // watch(
  //   './build/static/vendor/**/*.{css,js}',
  //   batch((e, cb) => {
  //     // gulp.start('dependencies', cb)
  //   })
  // );
  watch(
    './build/templates/**/*.html',
    batch((e, cb) => {
      console.log('Template refresh.');
      // gulp.start('templates', cb)
    })
  );
  watch(
    [
      './build/static/images/**/*',
      '!./build/static/images/opt/**/*',
      '!**/*.crdownload' // Ignore chrome's temp file
    ],
    batch((e, cb) => { gulp.start('img', done); })
  );
};
