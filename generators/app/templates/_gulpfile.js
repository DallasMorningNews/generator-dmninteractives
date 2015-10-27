'use strict';
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nodemon = require('gulp-nodemon'),
    nunjucksRender = require('gulp-nunjucks-render'),
    changed = require('gulp-changed'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    imageResize = require('gulp-image-resize'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip'),
    gulpIgnore = require('gulp-ignore'),
    awspublish = require('gulp-awspublish'),
    confirm = require('gulp-confirm'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    merge = require('merge-stream'),
    open = require("open");


////////////////////////////
/// Server Tasks

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

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync({
    proxy: 'http://localhost:3000',
    //Watch all files in preview directory for changes and reload
    files: ['./preview/**/*.*'],
    port: 4000,
    browser: ['google-chrome']
  });
});


////////////////////////////
/// Preview Tasks

gulp.task('dependencies', function () {

  var css = gulp.src('./build/static/vendor/**/*.js')
    .pipe(concat('dependency-bundle.js')) // Bundle JS
    .pipe(uglify())
    .pipe(gulp.dest('./preview/static/js'));

  var js = gulp.src('./build/static/vendor/**/*.css')
    .pipe(concat('dependency-bundle.css')) // Bundle CSS
    .pipe(minifyCss({ keepSpecialComments : 0, processImport: false })) // Don't keep CSS comments or process import statements like google fonts
    .pipe(gulp.dest('./preview/static/css'));

  return merge(css, js);
});

gulp.task('js', function () {
  // Copy data assets
  var data = gulp.src('./build/static/js/**/*.json')
    .pipe(gulp.dest('./preview/static/js'));
  // Copy bundled scripts
  var bundled = gulp.src('./build/static/js/**/+*.js')
    .pipe(concat('scripts-bundle.js'))
    .pipe(gulp.dest('./preview/static/js'));
  // Copy non-bundled scripts
  var copied = gulp.src(['./build/static/js/**/*.js','!./build/static/js/**/+*.js'])
    .pipe(gulp.dest('./preview/static/js'));

  return merge(data, bundled, copied);
});

gulp.task('scss', function () {
  // Compile bundled SCSS
  var bundled = gulp.src('./build/static/sass/**/+*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: ".scss.css"}))
    .pipe(gulp.dest('./build/static/css/common'));
  // Compile non-bundled SCSS
  var copied = gulp.src(['./build/static/sass/**/*.scss','!./build/static/sass/**/+*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: ".scss.css"}))
    .pipe(gulp.dest('./build/static/css'));

  return merge(bundled, copied);
});

gulp.task('css', ['scss'] ,function () {
  // Copy bundled CSS
  var bundled = gulp.src('./build/static/css/**/+*.css')
    .pipe(concat('styles-bundle.css'))
    .pipe(gulp.dest('./preview/static/css'));
  // Copy non-bundled CSS
  var copied = gulp.src(['./build/static/css/**/*.css','!./build/static/css/**/+*.css'])
    .pipe(gulp.dest('./preview/static/css'));

  return merge(bundled, copied);
});

gulp.task('img',function () {
  function resize(size){
    return gulp.src(['./build/static/img/**/*.{png,jpg,JPG}','!./build/static/img/**/_*.{png,jpg,JPG}'])
      .pipe(changed('./preview/static/img')) // Only process changed images for speed.
      .pipe(imageResize({ width : size, upscale : false }))
      .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
      .pipe(rename(function (path)  { 
                                      path.basename += ("-" + size.toString()); 
                                      path.extname = path.extname.toLowerCase(); 
                                      return path; 
                                    }))
      .pipe(gulp.dest('./preview/static/img'));
  }

  // Copies over SVGs or other image files
  var other = gulp.src(['./build/static/img/**/*','!./build/static/img/**/*.{png,jpg,JPG}'])
    .pipe(changed('./preview/static/img'))
    .pipe(gulp.dest('./preview/static/img'));
  // Copy explicitly non-altered imgs
  var copied = gulp.src('./build/static/img/**/_*.{png,jpg,JPG}')
    .pipe(changed('./preview/static/img'))
    .pipe(gulp.dest('./preview/static/img'));

  // Create and copy resized imgs
  var s1 = resize(3000);
  var s2 = resize(2400);
  var s3 = resize(1800);
  var s4 = resize(1200);
  var s5 = resize(600);

  return merge(other, copied, s1, s2, s3, s4, s5);
});

// Watch for new images added and run img task
gulp.task('watch', function () {
    watch('./build/static/img/**/*', batch(function (events, done) {
        gulp.start('img', done);
    }));
});

gulp.task('templates', function () {
    var meta = require('./meta.json');
    nunjucksRender.nunjucks.configure(['build/templates/'], {watch: false});
    return gulp.src(['build/templates/**/*.html','!build/templates/base.html','!build/templates/partials/**/*.html'])
        .pipe(nunjucksRender(meta))
        .pipe(gulp.dest('preview'));
});

gulp.task('docs', ['browser-sync'], function(){
  open("https://github.com/DallasMorningNews/generator-dmninteractives/wiki/Cookbook");
});

////////////////////////////
/// Publish Tasks

gulp.task('mover', function(){
  return gulp.src(['./preview/**/*','!./preview/static/js/**/*.js','!./preview/static/css/**/*.css'])
    .pipe(gulp.dest('./publish'));
});

gulp.task('minJS', function(){
  return gulp.src('./preview/static/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./publish/static/js'));
});

gulp.task('minCSS',function(){
  return gulp.src('./preview/static/css/**/*.css')
    .pipe(minifyCss({ keepSpecialComments : 0, processImport: false }))
    .pipe(gulp.dest('./publish/static/css'));
});

gulp.task('zip', ['mover','minJS','minCSS'], function () {
  var meta = require('./meta.json');
  return gulp.src(['./*','!aws.json']) // Zip everything except aws credentials
      .pipe(zip(meta.name.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g,'-').toLowerCase() + '.zip'))
      .pipe(gulp.dest('publish'));
});



gulp.task('aws', ['zip'], function() {
  var awsJson = require('./aws.json'),
      meta = require('./meta.json'),
      appName = meta.name.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g,'-').toLowerCase(),
      year = meta.publishYear,
      publisher = awspublish.create(awsJson);

  return gulp.src('./publish/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory \''+year+'/'+appName+'\'. Are you sure?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/'+year+'/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:true}))
      .pipe(awspublish.reporter());
});


////////////////////////////
/// Task runs

gulp.task('default', ['img','scss','css','js','templates','dependencies','watch','browser-sync','docs'], function () {
  gulp.watch('build/static/sass/**/*.scss', ['scss','css']);
  gulp.watch('build/static/js/**/*.js*', ['js']);
  gulp.watch('build/static/css/**/*.css', ['css']);
  gulp.watch('build/static/vendor/**/*.{css,js}', ['dependencies']);
  gulp.watch('build/templates/**/*.html', ['templates']);
});

gulp.task('publish',['mover','minJS','minCSS','zip','aws']);