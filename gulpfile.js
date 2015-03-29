'use strict';

var del = require('del');
var gulp = require('gulp');
var runSequence = require('run-sequence');
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
    .pipe($.size({title: 'styles'}))
    .pipe(browserSync.reload({
      stream: true
    })
  );
});

gulp.task('wiredep', function() {
  return gulp.src('app/index.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./,
      exclude: ['bower_components/modernizr/modernizr.js'],
    }))
    .pipe(gulp.dest('app'));
});

gulp.task('copy', function () {
  return gulp.src(['app/images'], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}));
});

gulp.task('watch', function() {
  browserSync({
    notify: false,
    server: ['.tmp', 'app'],
    routes: {
      '/bower_components': 'bower_components'
    }
  });
  gulp.watch('app/scss/**/*.scss', ['styles']);
  gulp.watch('bower.json', ['wiredep']);
  gulp.watch([
    'app/index.html',
    'images/**/*.**'
  ]).on('change', browserSync.reload);
});

gulp.task('clean', del.bind(null, ['.tmp', 'dist/*', '!dist/.git'], {dot: true}));

// Optimize images
gulp.task('images', function () {
  return gulp.src([
    'app/images/**/*',
    '!app/images/icons.svg'
  ])
    .pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    })))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}));
});

gulp.task('html', function() {
  var assets = $.useref.assets({searchPath: ['.tmp', 'app', '.']});
  return gulp.src('app/index.html')
    .pipe(assets)
    // Concatenate and minify JavaScript files
    .pipe($.if('*.js', $.uglify({preserveComments: 'some'})))
    // Remove unused styles
    // TODO: Disabled now since it doesn't work well with Modernizr's classes
    // .pipe($.if('*.css', $.uncss({
    //   html: [
    //     'app/index.html'
    //   ],
    // })))
    // Minify CSS
    .pipe($.if('*.css', $.csso()))
		.pipe($.rev())
    .pipe(assets.restore())
    .pipe($.useref())
		.pipe($.revReplace())
    // Minify HTML
    .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    // Output files
    .pipe(gulp.dest('dist'))
    .pipe($.size({title: 'html'}));
});

gulp.task('dev', ['clean'], function() {
  runSequence('styles', ['wiredep', 'watch']);
  browserSync.reload();
});

gulp.task('build', ['clean', 'wiredep'], function() {
  runSequence('styles', ['html', 'images'], function() {
    return gulp.src('dist/**/*').pipe($.size({title: 'build', gzip: true}));
  });
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['build'], function () {
  browserSync({
    notify: false,
    server: 'dist'
  });
});

gulp.task('default', ['build']);
