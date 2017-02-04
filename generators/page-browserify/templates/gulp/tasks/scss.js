const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


module.exports = () =>
    gulp.src(['./src/static/scss/**/*.scss', './src/static/scss/**/*.css'])
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./dist/css'));
