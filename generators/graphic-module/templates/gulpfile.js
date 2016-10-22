const util = require('gulp-util');

process.env.NODE_ENV = !!util.env.production ? 'production' : 'development';

const gulp = require('./gulp')([,
  'sass',
  'browserify',
  'server',
]);

gulp.task('build', ['sass', 'browserify', 'server']);
gulp.task('default', ['build']);
