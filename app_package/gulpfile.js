var gulp = require('gulp');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var shell = require('gulp-shell');
var livereload = require('gulp-livereload');

gulp.task('watch', function() {
  livereload.listen(3333);
  gulp.watch([
    './example*/**/*'
  ], function(file){
    livereload(file);
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
  livereload.listen({ basePath: './dist', port: 3333 });
});
