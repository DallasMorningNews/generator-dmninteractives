const gulp = require('gulp');


module.exports = () =>
    gulp.src('./src/static/assets/**/*')
      .pipe(gulp.dest('./dist/assets'));
