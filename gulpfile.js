'use strict';

var del = require('del');
var gulp = require('gulp');
var browserSync = require('browser-sync');
var wiredep = require('wiredep').stream;
var $ = require('gulp-load-plugins')();

gulp.task('styles', function() {
  return $.rubySass('app/scss/style.scss', {
    style: 'expanded',
    precision: 10,
    defaultEncoding: 'UTF-8',
    sourcemap: true
  }).pipe($.autoprefixer({
      browsers: ['last 2 version', 'ie 8', 'ie 9']
    }))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('.tmp/css'))
    .pipe(browserSync.reload({
      stream: true
    })
  );
});

gulp.task('bower', function() {
  gulp.src('app/index.html')
    .pipe(wiredep({}))
    .pipe(gulp.dest('app'));
});

gulp.task('copy', function () {
  return gulp.src(['app/images'], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

gulp.task('watch', function() {
  browserSync.init({
    server: ['.tmp', 'app']
  });
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('app/index.html', browserSync.reload);
  gulp.watch('images/**/*.{png, jpg, svg}', browserSync.reload);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

gulp.task('dev', ['clean', 'styles', 'watch'], function() {
  browserSync.reload();
});

gulp.task('build', [], function() {

});

gulp.task('default', ['build']);
