var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  nodemon = require('gulp-nodemon'),
  nunjucksRender = require('gulp-nunjucks-render'),
  sass = require('gulp-ruby-sass'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  zip = require('gulp-zip'),
  gulpIgnore = require('gulp-ignore'),
  awspublish = require('gulp-awspublish'),
  confirm = require('gulp-confirm');


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

gulp.task('js', function () {
  //Copy data assets
  gulp.src('./build/static/js/**/*.json')
    .pipe(gulp.dest('./public/static/js'))
    .pipe(browserSync.reload({ stream: true }));
  //Copy and concat all js assets
  gulp.src('./build/static/js/**/*.js')
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./public/static/js'))
    .pipe(browserSync.reload({ stream: true }));

});

gulp.task('scss', function () {
  //Compile scss
  return sass('./build/static/sass/**/*.scss', {
            style: 'compact'
        })
        .pipe(rename({extname: ".scss.css", prefix: "_"}))
        .pipe(gulp.dest('./build/static/css'))
        .pipe(browserSync.reload({ stream: true }));

});

gulp.task('sass', function(){
  //Compile sass
  return sass('./build/static/sass/**/*.sass', {
            style: 'compact'
        })
        .pipe(rename({extname: ".sass.css", prefix: "_"}))
        .pipe(gulp.dest('./build/static/css'))
        .pipe(browserSync.reload({ stream: true }));
});

gulp.task('css', function () {
  gulp.src('./build/static/css/**/*.css')
    .pipe(concat('styles.css'))
    .pipe(gulp.dest('./public/static/css'))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('browser-sync', ['nodemon'], function () {
  browserSync({
    proxy: 'http://localhost:3000',
    port: 4000,
    browser: ['google-chrome']
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('templates', function () {
    nunjucksRender.nunjucks.configure(['build/templates/'], {watch: false});
    return gulp.src('build/templates/index.html')
        .pipe(nunjucksRender())
        .pipe(gulp.dest('public'));
});

gulp.task('zip', function () {
  var meta = require('./meta.json');
  return gulp.src(['./*','!aws.json']) //exclude aws credentials
      .pipe(zip(meta.name + '.zip'))
      .pipe(gulp.dest('public'));
});

gulp.task('aws', function() {
  var awsJson = require('./aws.json'),
      meta = require('./meta.json'),
      appName = meta.name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(),
      year = meta.publishYear,
      publisher = awspublish.create(awsJson);

  if(awsJson.accessKeyId === '<ACCESS KEY>' || awsJson.secretAccessKey === '<SECRET KEY>'){
      console.log(">>> ERROR <<< Please add AWS credentials to aws.json before publishing.");
      return ;
  }

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


gulp.task('default', ['templates','scss','sass','css','js','browser-sync'], function () {
  gulp.watch('build/static/sass/**/*.scss', ['scss','css','bs-reload']);
  gulp.watch('build/static/sass/**/*.sass', ['sass','css','bs-reload']);
  gulp.watch('build/static/**/*.js*',   ['js','bs-reload']);
  gulp.watch('build/static/**/*.css',  ['css','bs-reload']);
  gulp.watch('build/templates/**/*.html', ['templates','bs-reload']);
});

gulp.task('publish',['zip','aws']);