const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');


module.exports = () =>
    gulp.src(['./build/static/scss/**/*.scss', './build/static/scss/**/*.css'])
      .pipe(sourcemaps.init())
      .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./public/css'));
