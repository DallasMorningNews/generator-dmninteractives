/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const es = require('event-stream');
const gulp = require('gulp');
const log = require('fancy-log');
const rename = require('gulp-rename');
const source = require('vinyl-source-stream');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const watchify = require('watchify');


module.exports = (watch) => {
  const wrapper = watch ? watchify : b => b;

  return () => {
    const files = [
      'scripts.js',
    ];

    const tasks = files.map((entry) => {
      const props = {
        entries: `./src/js/${entry}`,
        extensions: ['.js'],
        cache: {},
        packageCache: {},
        debug: true,
      };

      const bundler = wrapper(browserify(props).transform(babelify, {
        presets: ['env'],
      }));

      function bundle() {
        return bundler.bundle()
          .on('error', log.bind(log, 'Browserify Error'))
          .pipe(source(entry))
          .pipe(buffer())
          // eslint-disable-next-line no-param-reassign
          .pipe(rename((filePath) => { filePath.basename += '-bundle'; }))
          .pipe(sourcemaps.init({ loadMaps: true }))
          .pipe(uglify({ mangle: false, compress: true }).on('error', log))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./dist/js/'));
      }

      bundler.on('log', log);
      bundler.on('update', bundle);

      return bundle();
    });
    return es.merge.apply(null, tasks);
  };
};
