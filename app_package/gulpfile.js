var gulp = require('gulp');
var jspm = require('jspm');
var runSequence = require('run-sequence');

var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var vclPreprocessor = require('gulp-vcl-preprocessor');
var concat = require('gulp-concat');

gulp.task('vcl', function () {
  return gulp.src('vcl/index.styl')
    .pipe(vclPreprocessor())
    .pipe(autoprefixer())
    .pipe(concat('vcl.css'))
    .pipe(gulp.dest('.'));
})

gulp.task('watch', ['vcl'], function() {

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

gulp.task('css', ['vcl'], function() {
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
