var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var connect = require('gulp-connect');
var open = require('gulp-open');

gulp.task('watch', function() {
  connect.server({
    port:3333,
    livereload: true
  });
  gulp.src('./index.html')
    .pipe(open('', {
      url: 'http://localhost:3333',
    }));
  return gulp.watch([
    './example*/**/*'
  ], function(file){
    return gulp.src(file.path)
        .pipe(connect.reload());
  });
});

gulp.task('jspm', shell.task([
  'jspm bundle-sfx main dist/app.js'
]));

gulp.task('html', function() {
  return gulp.src('*-production.html')
    .pipe(rename(function(path) {
      path.basename = path.basename.slice(0, -11); // remove -production
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src(['custom.css'])
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src(['fonts/*'])
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('build', ['css', 'html', 'fonts', 'jspm']);

gulp.task('serve-dist', function() {
  connect.server({
    root: './dist',
    port: 3334
  });
  gulp.src('./index.html')
    .pipe(open({
      url: 'http://localhost:3334',
    }));
});
