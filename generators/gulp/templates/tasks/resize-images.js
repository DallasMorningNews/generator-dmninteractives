'use strict';
var gulp = require('gulp'),
	changed = require('gulp-changed'),
	fs = require('fs'),
	path = require('path'),
  rename = require('gulp-rename'),
	imageResize = require('gulp-image-resize'),
	merge = require('merge-stream');

module.exports = function() {
  function resize(size){

    /**
     * From gulp-changed source:
     * https://github.com/sindresorhus/gulp-changed/blob/master/index.js#L9
     */
    function fsOperationFailed(stream, sourceFile, err) {
      if (err) {
        if (err.code !== 'ENOENT') {
          stream.emit('error', new gutil.PluginError('gulp-changed', err, {
            fileName: sourceFile.path
          }));
        }
        stream.push(sourceFile);
      }
      return err;
    }

    /**
     * Custom comparator that takes into account filename changes.
     */
    function cacheCompare(stream, cb, sourceFile, targetPath) {
      var ext = path.extname(targetPath),
          dir = path.dirname(targetPath),
          base = path.basename(targetPath, ext),
          targetPath = path.join(dir, (base + ('-' + size.toString()) + ext.toLowerCase()));

      fs.stat(targetPath, function (err, targetStat) {
        if (!fsOperationFailed(stream, sourceFile, err)) {
          if (sourceFile.stat.mtime > targetStat.mtime) {
            stream.push(sourceFile);
          }
        }
        cb();
      });
    }

    return gulp.src([
        './build/static/images/opt/**/*.{png,jpg,JPG}',
        '!./build/static/images/opt/**/_*.{png,jpg,JPG}'
      ])
      .pipe(changed('./public/images',{hasChanged: cacheCompare}))
      .pipe(imageResize({ width : size, upscale : false, imageMagick : true }))
      .pipe(rename(function (path)  {
                                      path.basename += ('-' + size.toString());
                                      path.extname = path.extname.toLowerCase();
                                      return path;
                                    }))
      .pipe(gulp.dest('./public/images'));
  }

  // Create and copy resized pngs
  var s1 = resize(3000);
  var s2 = resize(2400);
  var s3 = resize(1800);
  var s4 = resize(1200);
  var s5 = resize(600);

  return merge(s1, s2, s3, s4, s5);
};