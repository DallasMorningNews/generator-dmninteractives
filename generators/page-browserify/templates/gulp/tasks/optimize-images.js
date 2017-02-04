const changed = require('gulp-changed');
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const merge = require('merge-stream');


module.exports = () => {
  const pngs = gulp.src([
    './src/static/images/**/*.png',
    '!./src/static/images/opt/**/*',
  ])
    .pipe(changed('./src/static/images/opt'))
    .pipe(
        imagemin({
          optimizationLevel: 4,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
        })
    )
    .pipe(gulp.dest('./src/static/images/opt'));

  const jpgs = gulp.src([
    './src/static/images/**/*.{jpg,JPG}',
    '!./src/static/images/opt/**/*',
  ])
    .pipe(changed('./src/static/images/opt'))
    .pipe(imageminJpegRecompress({
          loops: 3,
          min: 50,
          max: 75,
          target: 0.9999,
          progressive: true
        })()
    )
    .pipe(gulp.dest('./src/static/images/opt'));

  return merge(pngs, jpgs);
};
