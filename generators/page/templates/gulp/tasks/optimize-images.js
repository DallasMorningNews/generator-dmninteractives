/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const changed = require('gulp-changed');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const merge = require('merge-stream');


module.exports = () => {
  const pngs = gulp.src([
    './src/images/**/*.png',
    '!./src/images/opt/**/*',
  ])
    .pipe(changed('./src/images/opt'))
    .pipe(
        imagemin({
          optimizationLevel: 4,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
        })
    )
    .pipe(gulp.dest('./src/images/opt'));

  const jpgs = gulp.src([
    './src/images/**/*.{jpg,JPG}',
    '!./src/images/opt/**/*',
  ])
    .pipe(changed('./src/images/opt'))
    .pipe(imageminJpegRecompress({
          loops: 3,
          min: 50,
          max: 75,
          target: 0.9999,
          progressive: true
        })()
    )
    .pipe(gulp.dest('./src/images/opt'));

  return merge(pngs, jpgs);
};
