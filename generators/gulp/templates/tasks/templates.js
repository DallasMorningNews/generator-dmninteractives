'use strict';
var gulp = require('gulp'),
	nunjucksRender = require('gulp-nunjucks-render');

module.exports = function() {
    var meta = require('./../../meta.json');
    nunjucksRender.nunjucks.configure(['build/templates/'], {watch: false});
    return gulp.src([
    	'./build/templates/**/*.html',
    	'!./build/templates/base.html',
    	'!./build/templates/partials/**/*.html'
    ])
        .pipe(nunjucksRender(meta))
        .pipe(gulp.dest('./public'));
};