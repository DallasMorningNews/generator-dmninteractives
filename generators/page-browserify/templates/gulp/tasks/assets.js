const gulp = require('gulp');


module.exports = () =>
    gulp.src('./build/static/assets/**/*')
      .pipe(gulp.dest('./public/assets'));