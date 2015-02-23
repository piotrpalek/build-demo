var gulp = require('gulp');
gulp.task('watch', function() {

  var browserSync = require('browser-sync');

  browserSync({
    online: false,
    server: {
      baseDir: ['']
    }
  });

});