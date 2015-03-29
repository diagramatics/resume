'use strict';

var del = require('del');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
  return $.rubySass('scss/style.scss', {
      style: 'nested',
      precision: 10,
      defaultEncoding: 'UTF-8',
      sourcemap: true
    })
    .pipe($.autoprefixer({
      browsers: ['last 2 version', 'ie 8', 'ie 9']
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('css/'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: './',
      directory: true
    }
  });
});

gulp.task('clean', del.bind(null, ['dist/*', '!dist/.git'], {dot: true}));

gulp.task('dev', ['styles', 'watch'], function() {
  gulp.watch('scss/**/*.scss', ['styles']);
  gulp.watch('index.html', browserSync.reload);
  browserSync.reload();
});

gulp.task('build', [], function() {

});

gulp.task('default', ['build']);
