'use strict';
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    nunjucksRender = require('gulp-nunjucks-render'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    imageResize = require('gulp-image-resize'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip'),
    gulpIgnore = require('gulp-ignore'),
    awspublish = require('gulp-awspublish'),
    confirm = require('gulp-confirm'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch');


gulp.task('nodemon', function (cb) {
  var called = false;
  return nodemon({
    script: 'app.js',
    watch: ['app.js']
  })
    .on('start', function onStart() {
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', function onRestart() {
      //small reload delay
      setTimeout(function reload() {
        browserSync.reload({
          stream: false
        });
      }, 500);
    });
});

gulp.task('dependencies', function () {
  // Bundle JS
  gulp.src('./build/static/vendor/**/*.js')
    .pipe(concat('dependency-bundle.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/static/js'));
  // Bundle CSS
  gulp.src('./build/static/vendor/**/*.css')
    .pipe(concat('dependency-bundle.css'))
    .pipe(minifyCss({keepSpecialComments : 0}))
    .pipe(gulp.dest('./public/static/css'));
});

gulp.task('js', function () {
  //Copy data assets
  gulp.src('./build/static/js/**/*.json')
    .pipe(gulp.dest('./public/static/js'));
  //Copy and concat all js assets
  gulp.src('./build/static/js/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./public/static/js'));

});

gulp.task('scss', function () {
  //Compile scss
  gulp.src('./build/static/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: ".scss.css", prefix: "_"}))
    .pipe(gulp.dest('./build/static/css'));
});

gulp.task('css', function () {
  gulp.src('./build/static/css/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(minifyCss({keepSpecialComments : 0}))
    .pipe(gulp.dest('./public/static/css'));
});

gulp.task('img',function () {
  function resize(size){
    gulp.src('./build/static/img/**/*.{png,jpg}')
      .pipe(changed('./public/static/img'))
      .pipe(imageResize({ width : size, upscale : true }))
      .pipe(rename(function (path) { path.basename += ("-" + size.toString()); }))
      .pipe(gulp.dest('./public/static/img'));
  }

  // Copy original img
  gulp.src('./build/static/img/**/*.{png,jpg}')
    .pipe(changed('./public/static/img'))
    .pipe(gulp.dest('./public/static/img'));

  // Create and copy resized imgs
  resize(2400);
  resize(1280);
  resize(640);
  resize(320);

});


gulp.task('browser-sync', ['nodemon'], function () {
  browserSync({
    proxy: 'http://localhost:3000',
    //Watch all files in public directory for changes and reload
    files: ['./public/**/*.*'],
    port: 4000,
    browser: ['google-chrome']
  });
});

gulp.task('templates', function () {
    var meta = require('./meta.json');
    nunjucksRender.nunjucks.configure(['build/templates/'], {watch: false});
    return gulp.src('build/templates/index.html')
        .pipe(nunjucksRender(meta))
        .pipe(gulp.dest('public'));
});

gulp.task('zip', function () {
  var meta = require('./meta.json');
  return gulp.src(['./*','!aws.json']) //exclude aws credentials
      .pipe(zip(meta.name.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g,'-').toLowerCase() + '.zip'))
      .pipe(gulp.dest('public'));
});

gulp.task('aws', ['zip'],function() {
  var awsJson = require('./aws.json'),
      meta = require('./meta.json'),
      appName = meta.name.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g,'-').toLowerCase(),
      year = meta.publishYear,
      publisher = awspublish.create(awsJson);

  return gulp.src('./public/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory \''+year+'/'+appName+'\'. Are you sure?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/'+year+'/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish())
      .pipe(awspublish.reporter());
});

gulp.task('watch', function () {
    watch('./build/static/img/**/*.{png,jpg}', batch(function (events, done) {
        gulp.start('img', done);
    }));
});


gulp.task('default', ['templates','img','scss','css','js','dependencies','watch','browser-sync'], function () {
  gulp.watch('build/static/sass/**/*.scss', ['scss','css']);
  gulp.watch('build/static/js/**/*.js*', ['js']);
  gulp.watch('build/static/css/**/*.css', ['css']);
  gulp.watch('build/static/vendor/**/*.{css,js}', ['dependencies']);
  gulp.watch('build/templates/**/*.html', ['templates']);
});

gulp.task('publish',['zip','aws']);