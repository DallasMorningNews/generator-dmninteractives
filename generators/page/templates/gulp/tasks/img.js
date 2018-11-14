/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageresize = require('gulp-image-resize');
const merge = require('merge-stream');
const rename = require('gulp-rename');


const globs = {};
globs.underscoredJPG = './src/images/**/_*.{jpg,JPG}';
globs.underscoredPNG = './src/images/**/_*.png';
globs.generalJPG = ['./src/images/**/*.{jpg,JPG}', `!${globs.underscoredJPG}`];
globs.generalPNG = ['./src/images/**/*.png', `!${globs.underscoredPNG}`];
globs.allOtherImages = ['./src/images/**/*', '!./src/images/**/*.{crdownload,png,jpg,JPG}'];


const imageExportTypes = [
  // Sizes for non-underscore-prefixed JPEGs (will be resized and minified):
  { width: 600, globs: globs.generalJPG, type: 'jpg' },
  { width: 1200, globs: globs.generalJPG, type: 'jpg' },
  { width: 1800, globs: globs.generalJPG, type: 'jpg' },
  { width: 2400, globs: globs.generalJPG, type: 'jpg' },
  { width: 3000, globs: globs.generalJPG, type: 'jpg' },

  // Sizes for non-underscore-prefixed PNGs (will be resized and minified):
  { width: 600, globs: globs.generalPNG, type: 'png' },
  { width: 1200, globs: globs.generalPNG, type: 'png' },
  { width: 1800, globs: globs.generalPNG, type: 'png' },
  { width: 2400, globs: globs.generalPNG, type: 'png' },
  { width: 3000, globs: globs.generalPNG, type: 'png' },

  // Configs for underscore-prefixed JPEGs and PNGs (will only be minified):
  { globs: globs.underscoredJPG, type: 'jpg' },
  { globs: globs.underscoredPNG, type: 'png' },

  // Config for all other image files (will be moved but not resized/minified):
  { globs: globs.allOtherImages },
];

const imgDestination = './dist/images';


module.exports = () => {
  const exports = imageExportTypes.map((exportType) => {
    const isResized = Object.prototype.hasOwnProperty.call(exportType, 'width');

    const isMinified = (
      Object.prototype.hasOwnProperty.call(exportType, 'type')
    ) && ['jpg', 'png'].includes(exportType.type);

    let gulpTask = gulp.src(exportType.globs)

    // gulpTask = gulpTask.newer()

    if (isResized) {
      const resizeOpts = { imageMagick: true, upscale: false, width: exportType.width };

      gulpTask = gulpTask.pipe(imageresize(resizeOpts));
    }

    gulpTask = gulpTask.pipe(newer(imgDestination));

    if (isMinified) {
      gulpTask = gulpTask.pipe(
        (
          exportType.imageType === 'jpg'
        ) ? (
          imageminJpegRecompress({
            loops: 3,
            min: 50,
            max: 75,
            target: 0.9999,
            progressive: true
          })()
        ) : (
          imagemin({
            optimizationLevel: 4,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
          })
        )
      );

      if (isResized) {
        gulpTask = gulpTask.pipe(rename(path => {
          path.basename = `${path.basename}-${exportType.width.toString()}`;
          path.extname = path.extname.toLowerCase();
          return path;
        }));
      }
    }

    gulpTask = gulpTask.pipe(gulp.dest(imgDestination));

    return gulpTask;
  });

  return merge.apply(null, exports);
};
