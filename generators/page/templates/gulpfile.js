var runSequence = require('run-sequence'),
    S = require('string'),
    meta = require('./meta.json'),
    appName = S(meta.name).slugify().s,
    gulp = require('./gulp')([
        'assets',
        'aws',
        'browser-sync',
        'clear-test',
        'css',
        'dependencies',
        'plain-images',
        'js',
        'optimize-images',
        'resize-images',
        'sass',
        'scss',
        'templates',
        'test',
        'watch-images'
    ]);


gulp.task('img', function(callback){
  runSequence('optimize-images','resize-images','plain-images', callback);
});

gulp.task('styles', function(callback){
  runSequence('scss','sass','css', callback);
});

gulp.task('default', ['assets','img','js','styles','templates','dependencies','watch-images','browser-sync'], function () {
  gulp.watch('build/static/assets/**/*', ['assets']);
  gulp.watch('build/static/sass/**/*.{scss,sass}', ['scss','sass','css']);
  gulp.watch('build/static/js/**/*.js*', ['js']);
  gulp.watch('build/static/css/**/*.css', ['css']);
  gulp.watch('build/static/vendor/**/*.{css,js}', ['dependencies']);
  gulp.watch('build/templates/**/*.html', ['templates']);
});

gulp.task('package',function(callback){
  runSequence('aws','clear-test', callback)
});

gulp.task('publish',['package'], function(){
  console.log('Published at: http://interactives.dallasnews.com/' + meta.publishYear + '/' + appName);
});

gulp.task('publish-test',['test'],function(){
  console.log('public at: http://interactives.dallasnews.com/test/' + appName);
});
