const changed = require('gulp-changed');
const gulp = require('gulp');
const merge = require('merge-stream');


module.exports = () => {
  // Copies over SVGs or other image files
  const other = gulp.src([
    './build/static/images/**/*',
    '!./build/static/images/**/*.{png,jpg,JPG}',
    '!./build/static/images/opt/**/*'
  ],{ nodir: true })
    .pipe(changed('./public/images'))
    .pipe(gulp.dest('./public/images'));

  // Copy imgs that weren't resized
  const copied = gulp.src('./build/static/images/opt/**/_*.{png,jpg,JPG}')
    .pipe(changed('./public/images'))
    .pipe(gulp.dest('./public/images'));

  return merge(other, copied);
};
