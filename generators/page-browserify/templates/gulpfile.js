const runSequence = require('run-sequence');
const S = require('string');


const gulp = require('./gulp')([
  'assets',
  'aws',
  // 'clear-test',
  // 'dependencies',
  'plain-images',
  // 'js',
  'optimize-images',
  'resize-images',
  'scss',
  // 'templates',
  // 'test',
  // 'watch-images',
  'server'
]);
const meta = require('./meta.json');


const appName = S(meta.name).slugify().s;


gulp.task('img', callback => {
  runSequence('optimize-images','resize-images','plain-images', callback);
});

gulp.task('styles', callback => { runSequence('scss', callback) });

gulp.task('default', [
  'assets',
  'img',
  // 'js',
  'styles',
  // 'templates',
  // 'dependencies',
  // 'watch-images',
  'server'
], () => {});

// gulp.task('package',function(callback){
//   runSequence('aws','clear-test', callback)
// });

// gulp.task('publish',['package'], function(){
//   console.log('Published at: http://interactives.dallasnews.com/' + meta.publishYear + '/' + appName);
// });

// gulp.task('publish-test',['test'],function(){
//   console.log('public at: http://interactives.dallasnews.com/test/' + appName);
// });
