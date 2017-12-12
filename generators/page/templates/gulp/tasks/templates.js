/* eslint-disable strict */

'use strict';

/* eslint-enable strict */

const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');


const meta = require('./../../meta.json');


module.exports = () => {
  nunjucksRender.nunjucks.configure(['src/templates/'], { watch: false });

  return gulp.src([
    './src/templates/**/*.html',
    '!./src/templates/base.html',
    '!./src/templates/partials/**/*.html',
    '!./src/templates/adblock*.html',
  ])
    .pipe(nunjucksRender(meta))
    .pipe(gulp.dest('./dist'));
};
