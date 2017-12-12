'use strict';

const browserify = require('browserify');
const gulp = require('gulp');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const watchify = require('watchify');
const gutil = require('gulp-util');
const babelify = require('babelify');
const es = require('event-stream');

module.exports = (watch) => {
  const wrapper = watch ? watchify : (b) => b;

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
          .on('error', gutil.log.bind(gutil, 'Browserify Error'))
          .pipe(source(entry))
          .pipe(buffer())
          .pipe(sourcemaps.init({ loadMaps: true }))
          .pipe(uglify({ mangle: false, compress: true }).on('error', gutil.log))
          .pipe(sourcemaps.write('./'))
          .pipe(gulp.dest('./dist/js/'));
      }

      bundler.on('log', gutil.log);
      bundler.on('update', bundle);

      return bundle();
    });
    return es.merge.apply(null, tasks);
  }
};
