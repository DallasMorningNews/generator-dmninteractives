'use strict';
var gulp = require('gulp'),
	changed = require('gulp-changed'),
	imagemin = require('gulp-imagemin'),
	imageminJpegRecompress = require('imagemin-jpeg-recompress'),
	merge = require('merge-stream');

module.exports = function() {
  var pngs = gulp.src([
      './build/static/images/**/*.png',
      '!./build/static/images/opt/**/*'
    ])
    .pipe(changed('./build/static/images/opt'))
    .pipe(
        imagemin({
          optimizationLevel: 4,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
        })
    )
    .pipe(gulp.dest('./build/static/images/opt'));

  var jpgs = gulp.src([
      './build/static/images/**/*.{jpg,JPG}',
      '!./build/static/images/opt/**/*'
    ])
    .pipe(changed('./build/static/images/opt'))
    .pipe(imageminJpegRecompress({
          loops: 3,
          min: 50,
          max: 75,
          target: 0.9999,
          progressive: true
        })()
    )
    .pipe(gulp.dest('./build/static/images/opt'));

  return merge(pngs, jpgs);
};
