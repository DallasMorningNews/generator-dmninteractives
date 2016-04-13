'use strict';
var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    nunjucksRender = require('gulp-nunjucks-render'),
    sass = require('gulp-sass'),
    minifyCss = require('gulp-minify-css'),
    changed = require('gulp-changed'),
    del = require('del'),
    imageResize = require('gulp-image-resize'),
    imagemin = require('gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    mainBowerFiles = require('main-bower-files'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    zip = require('gulp-zip'),
    confirm = require('gulp-confirm'),
    awspublish = require('gulp-awspublish'),
    aws = require('aws-sdk'),
    watch = require('gulp-watch'),
    batch = require('gulp-batch'),
    merge = require('merge-stream'),
    S = require('string'),
    path = require('path'),
    fs = require('fs');


var awsJson = require('./aws.json'),
    meta = require('./meta.json'),
    appName = S(meta.name).slugify().s;

////////////////////////////
/// Server

gulp.task('browser-sync', function () {
  browserSync.init({
      files: ['./public/**/*'],
      server: {
          baseDir: './public/'
      },
      ghostMode: false
  });
});


////////////////////////////
/// Public Tasks

gulp.task('dependencies', function () {

  var js = gulp.src(mainBowerFiles('**/*.js'), { base: 'build/static/vendor' })
    .pipe(sourcemaps.init())
    .pipe(concat('dependency-bundle.js')) // Bundle JS
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));

  var css = gulp.src(mainBowerFiles('**/*.css'), { base: 'build/static/vendor' })
    .pipe(sourcemaps.init())
    .pipe(concat('dependency-bundle.css')) // Bundle CSS
    .pipe(minifyCss({ keepSpecialComments : 0, processImport: false })) // Don't keep CSS comments or process import statements like google fonts
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/css'));

  return merge(css, js);
});

gulp.task('assets', function () {
  var assets = gulp.src('./build/static/assets/**/*')
    .pipe(gulp.dest('./public/assets'));
  return assets;
});

gulp.task('js', function () {
  // Copy data assets
  var data = gulp.src('./build/static/js/**/*.json')
    .pipe(gulp.dest('./public/js'));
  // Copy bundled scripts
  var bundled = gulp.src('./build/static/js/**/+*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(sourcemaps.init())
    .pipe(concat('scripts-bundle.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));
  // Copy non-bundled scripts
  var copied = gulp.src(['./build/static/js/**/*.js','!./build/static/js/**/+*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./public/js'));

  return merge(data, bundled, copied);
});

gulp.task('scss', function () {
  // Compile bundled SCSS
  var bundled = gulp.src('./build/static/sass/**/+*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: '.scss.css'}))
    .pipe(gulp.dest('./build/static/css/common'));
  // Compile non-bundled SCSS
  var copied = gulp.src(['./build/static/sass/**/*.scss','!./build/static/sass/**/+*.scss'])
    .pipe(sass().on('error', sass.logError))
    .pipe(rename({extname: '.scss.css'}))
    .pipe(gulp.dest('./build/static/css'));

  return merge(bundled, copied);
});

gulp.task('sass', function () {
  // Compile bundled SCSS
  var bundled = gulp.src('./build/static/sass/**/+*.sass')
    .pipe(sass({indentedSyntax: true}).on('error', sass.logError))
    .pipe(rename({extname: '.sass.css'}))
    .pipe(gulp.dest('./build/static/css/common'));
  // Compile non-bundled SCSS
  var copied = gulp.src(['./build/static/sass/**/*.sass','!./build/static/sass/**/+*.sass'])
    .pipe(sass({indentedSyntax: true}).on('error', sass.logError))
    .pipe(rename({extname: '.sass.css'}))
    .pipe(gulp.dest('./build/static/css'));

  return merge(bundled, copied);
});

gulp.task('css', ['scss','sass'] ,function () {
  // Copy bundled CSS
  var bundled = gulp.src('./build/static/css/**/+*.css')
    .pipe(concat('styles-bundle.css'))
    .pipe(gulp.dest('./public/css'));
  // Copy non-bundled CSS
  var copied = gulp.src(['./build/static/css/**/*.css','!./build/static/css/**/+*.css'])
    .pipe(gulp.dest('./public/css'));

  return merge(bundled, copied);
});


gulp.task('optimize-images', function(){

  var pngs = gulp.src([
      './build/static/images/**/*.png',
      '!./build/static/images/opt/**/*'
    ])
    .pipe(changed('./build/static/images/opt'))
    .pipe(
        imagemin({
          optimizationLevel: 4,
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
        })
    )
    .pipe(gulp.dest('./build/static/images/opt'));

  var jpgs = gulp.src([
      './build/static/images/**/*.{jpg,JPG}',
      '!./build/static/images/opt/**/*'
    ])
    .pipe(changed('./build/static/images/opt'))
    .pipe(imageminJpegRecompress({
          loops: 3,
          min: 50,
          max: 75,
          target: 0.9999
        })()
    )
    .pipe(gulp.dest('./build/static/images/opt'));

  return merge(pngs, jpgs);
});


gulp.task('resize-images',['optimize-images'],function () {
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
});


gulp.task('img',['resize-images'], function() {
  // Copies over SVGs or other image files
  var other = gulp.src([
      './build/static/images/**/*',
      '!./build/static/images/**/*.{png,jpg,JPG}',
      '!./build/static/images/opt/**/*'
    ],{ nodir: true })
    .pipe(changed('./public/images'))
    .pipe(gulp.dest('./public/images'));
  // Copy imgs that weren't resized
  var copied = gulp.src('./build/static/images/opt/**/_*.{png,jpg,JPG}')
    .pipe(changed('./public/images'))
    .pipe(gulp.dest('./public/images'));

  return merge(other, copied);
});


// Watch for new images added and run img task
gulp.task('watch-images', function () {
    watch([
      './build/static/images/**/*',
      '!./build/static/images/opt/**/*',
      '!**/*.crdownload'
      ], batch(function (events, done) {
        gulp.start('img', done);
    }));
});

gulp.task('templates', function () {
    var meta = require('./meta.json');
    nunjucksRender.nunjucks.configure(['build/templates/'], {watch: false});
    return gulp.src(['build/templates/**/*.html','!build/templates/base.html','!build/templates/partials/**/*.html'])
        .pipe(nunjucksRender(meta))
        .pipe(gulp.dest('public'));
});



////////////////////////////
/// Publish Tasks

gulp.task('zip', function () {
  return gulp.src(['./**/*','!aws.json','!node_modules/**/*','!.git/*','!./**/*.zip','!./build/static/vendor/**/*']) // Zip everything except aws credentials, node modules, bower components, git files and zip files
      .pipe(zip(appName + '.zip'))
      .pipe(gulp.dest('public'));
});


gulp.task('aws', ['zip'], function() {
  var year = meta.publishYear,
      publisher = awspublish.create(awsJson);

  return gulp.src('./public/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory \''+year+'/'+appName+'\'. In the process, we\'ll also wipe out any uploads to the test directory. Are you sure you want to do this?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/'+year+'/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:false}))
      .pipe(publisher.cache())
      .pipe(awspublish.reporter());
});


// Publish to a test directory.
gulp.task('test', ['zip'], function() {
  var publisher = awspublish.create(awsJson);
  return gulp.src('./public/**/*')
      .pipe(confirm({
        question: 'You\'re about to publish this project to AWS under directory test/\''+appName+'\'. Are you sure?',
        input: '_key:y'
      }))
      .pipe(rename(function (path) {
          path.dirname = '/test/'+appName + '/' + path.dirname.replace('.\\','');
      }))
      .pipe(publisher.publish({},{force:false}))
      .pipe(publisher.cache())
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

gulp.task('default', ['assets','img','scss','sass','css','js','templates','dependencies','watch-images','browser-sync'], function () {
  gulp.watch('build/static/assets/**/*', ['assets']);
  gulp.watch('build/static/sass/**/*.{scss,sass}', ['scss','sass','css']);
  gulp.watch('build/static/js/**/*.js*', ['js']);
  gulp.watch('build/static/css/**/*.css', ['css']);
  gulp.watch('build/static/vendor/**/*.{css,js}', ['dependencies']);
  gulp.watch('build/templates/**/*.html', ['templates']);
});

gulp.task('publish',['zip','aws','clear-test'], function(){
  console.log('Published at: http://interactives.dallasnews.com/' + meta.publishYear + '/' + appName);
});

gulp.task('publish-test',['zip','test'],function(){
  console.log('public at: http://interactives.dallasnews.com/test/' + appName);
});

