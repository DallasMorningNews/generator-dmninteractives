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
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
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
    aws = require('aws-sdk');


var awsJson = require('./aws.json'),
    meta = require('./meta.json'),
    appName = meta.name.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g,'-').toLowerCase();

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

gulp.task('assets', function () {
  var assets = gulp.src('./build/static/assets/**/*')
    .pipe(gulp.dest('./preview/static/assets'));
  return assets;
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

gulp.task('sass', function () {
  // Compile bundled SCSS
  var bundled = gulp.src('./build/static/sass/**/+*.sass')
    .pipe(sass({indentedSyntax: true}).on('error', sass.logError))
    .pipe(rename({extname: ".sass.css"}))
    .pipe(gulp.dest('./build/static/css/common'));
  // Compile non-bundled SCSS
  var copied = gulp.src(['./build/static/sass/**/*.sass','!./build/static/sass/**/+*.sass'])
    .pipe(sass({indentedSyntax: true}).on('error', sass.logError))
    .pipe(rename({extname: ".sass.css"}))
    .pipe(gulp.dest('./build/static/css'));

  return merge(bundled, copied);
});

gulp.task('css', ['scss','sass'] ,function () {
  // Copy bundled CSS
  var bundled = gulp.src('./build/static/css/**/+*.css')
    .pipe(concat('styles-bundle.css'))
    .pipe(gulp.dest('./preview/static/css'));
  // Copy non-bundled CSS
  var copied = gulp.src(['./build/static/css/**/*.css','!./build/static/css/**/+*.css'])
    .pipe(gulp.dest('./preview/static/css'));

  return merge(bundled, copied);
});

gulp.task('png',function () {
  function resize(size){
    return gulp.src(['./build/static/images/**/*.png','!./build/static/images/**/_*.png'])
      .pipe(changed('./preview/static/images')) // Only process changed images for speed.
      .pipe(imageResize({ width : size, upscale : false, imageMagick : true }))
      .pipe(imagemin({
            optimizationLevel: 4, 
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
        }))
      .pipe(rename(function (path)  { 
                                      path.basename += ("-" + size.toString()); 
                                      path.extname = path.extname.toLowerCase(); 
                                      return path; 
                                    }))
      .pipe(gulp.dest('./preview/static/images'));
  }

  // Create and copy resized pngs
  var s1 = resize(3000);
  var s2 = resize(2400);
  var s3 = resize(1800);
  var s4 = resize(1200);
  var s5 = resize(600);

  return merge(s1, s2, s3, s4, s5);
});

gulp.task('jpg',function () {
  function resize(size){
    return gulp.src(['./build/static/images/**/*.{jpg,JPG}','!./build/static/images/**/_*.{jpg,JPG}'])
      .pipe(changed('./preview/static/images')) // Only process changed images for speed.
      .pipe(imageResize({ width : size, upscale : false, imageMagick : true }))
      .pipe(imageminJpegRecompress({
        loops: 3,
        min: 50,
        max: 75,
        target: 0.9999
      })())
      .pipe(rename(function (path)  { 
                                      path.basename += ("-" + size.toString()); 
                                      path.extname = path.extname.toLowerCase(); 
                                      return path; 
                                    }))
      .pipe(gulp.dest('./preview/static/images'));
  }

  // Create and copy resized jpgs
  var s1 = resize(3000);
  var s2 = resize(2400);
  var s3 = resize(1800);
  var s4 = resize(1200);
  var s5 = resize(600);

  return merge(s1, s2, s3, s4, s5);
});

gulp.task('img',['png','jpg'], function() {
  // Copies over SVGs or other image files
  var other = gulp.src(['./build/static/images/**/*','!./build/static/images/**/*.{png,jpg,JPG}'])
    .pipe(changed('./preview/static/images'))
    .pipe(gulp.dest('./preview/static/images'));
  // Copy explicitly non-altered imgs
  var copied = gulp.src('./build/static/images/**/_*.{png,jpg,JPG}')
    .pipe(changed('./preview/static/images'))
    .pipe(gulp.dest('./preview/static/images'));

  return merge(other, copied);
});

// Watch for new images added and run img task
gulp.task('watch', function () {
    watch('./build/static/images/**/*', batch(function (events, done) {
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



////////////////////////////
/// Publish Tasks

gulp.task('mover', function(){
  return gulp.src(['./preview/**/*','!./preview/static/**/*'])
    .pipe(gulp.dest('./publish'));
});

gulp.task('pubStatic', function(){
  return gulp.src(['./preview/static/**/*','!./preview/static/js/**/*.js','!./preview/static/css/**/*.css','!./preview/static/images/**/*.{png,jpg,JPG}'])
    .pipe(gulp.dest('./publish'));
})

gulp.task('pubImg',function(){
  return gulp.src('./preview/static/images/**/*.{png,jpg,JPG}')
    .pipe(gulp.dest('./publish/images'));
})

gulp.task('pubJS', function(){
  return gulp.src('./preview/static/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./publish/js'));
});

gulp.task('pubCSS',function(){
  return gulp.src('./preview/static/css/**/*.css')
    .pipe(minifyCss({ keepSpecialComments : 0, processImport: false }))
    .pipe(gulp.dest('./publish/css'));
});

gulp.task('zip', ['mover','pubStatic','pubImg','pubJS','pubCSS'], function () {
  return gulp.src(['./**/*','!aws.json','!node_modules/**/*','!.git/*','!./**/*.zip']) // Zip everything except aws credentials, node modules, git files and zip files
      .pipe(zip(appName + '.zip'))
      .pipe(gulp.dest('publish'));
});


gulp.task('aws', ['zip'], function() {
  var year = meta.publishYear,
      publisher = awspublish.create(awsJson);

  return gulp.src('./publish/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory \''+year+'/'+appName+'\'. In the process, we\'ll also wipe out any uploads to the test directory. Are you sure you want to do this?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/'+year+'/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:true}))
      .pipe(awspublish.reporter());
});

// Publish to a test directory.
gulp.task('test', ['zip'], function() {
  var publisher = awspublish.create(awsJson);
  return gulp.src('./publish/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory test/\''+appName+'\'. Are you sure?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/test/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:true}))
      .pipe(awspublish.reporter());
});


// Clears the files uploaded to a test directory
gulp.task('clear-test', ['aws'],function() {

  aws.config.update({
        accessKeyId: awsJson.accessKeyId, 
        secretAccessKey: awsJson.secretAccessKey,
        region: 'us-east-1'
      });

  var s3 = new aws.S3(),
      params = {
        Bucket: awsJson.params.Bucket,
        // Do not change this!
        Prefix: 'test/' + appName
      };

  s3.listObjects(params, function(err, data) {
    if (err) return console.log(err);

    params = {Bucket: awsJson.params.Bucket};
    params.Delete = {};
    params.Delete.Objects = [];

    data.Contents.forEach(function(content) {
      params.Delete.Objects.push({Key: content.Key});
    });

    if(params.Delete.Objects.length > 0){
      s3.deleteObjects(params, function(err, data) {
        return console.log(data.Deleted.length);
      });
    }
    
  });
});

////////////////////////////
/// Task runs

gulp.task('default', ['assets','scss','sass','css','js','templates','dependencies','watch','browser-sync'], function () {
  gulp.watch('build/static/assets/**/*', ['assets']);
  gulp.watch('build/static/sass/**/*.{scss,sass}', ['scss','sass','css']);
  gulp.watch('build/static/js/**/*.js*', ['js']);
  gulp.watch('build/static/css/**/*.css', ['css']);
  gulp.watch('build/static/vendor/**/*.{css,js}', ['dependencies']);
  gulp.watch('build/templates/**/*.html', ['templates']);
});

gulp.task('publish',['mover','pubStatic','pubImg','pubJS','pubCSS','zip','aws','clear-test'], function(){
  console.log('Published at: http://interactives.dallasnews.com/'+meta.publishYear+ '/' + appName);
});

gulp.task('publish-test',['mover','pubStatic','pubImg','pubJS','pubCSS','zip','test'],function(){
  console.log('Preview at: http://interactives.dallasnews.com/test/' + appName);
});