var gulp = require('gulp');
var jspm = require('jspm');
var runSequence = require('run-sequence');

var rename = require('gulp-rename');

gulp.task('watch', function() {

  var browserSync = require('browser-sync');

  browserSync({
    online: false,
    port: 3333,
    server: {
      baseDir: ['']
    }
  });

  gulp.watch([
    './**/*'
  ], function(file){
    browserSync.reload(file.path);
  });

});

gulp.task('jspm', function() {
  return jspm.bundleSFX('main', 'dist/app.js', { sourceMaps: false, minify: true, mangle: true});
});

gulp.task('html', function() {
  return gulp.src('*-production.html')
    .pipe(rename(function(path) {
      path.basename = path.basename.slice(0, -11); // remove -production
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('css', function() {
  return gulp.src(['vcl.css', 'custom.css'])
    .pipe(gulp.dest('dist'));
});

gulp.task('fonts', function() {
  return gulp.src(['fonts/*'])
    .pipe(gulp.dest('dist/fonts'));
});


gulp.task('build', ['css', 'html', 'fonts', 'jspm']);

gulp.task('serve-dist', function() {

  var browserSync = require('browser-sync');

  browserSync({
    online: false,
    port: 3333,
    server: {
      baseDir: ['./dist']
    }
  });

});
