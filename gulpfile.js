var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('make', function() {
  return gulp.src(['src/*.js'])
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('.'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['make'], function() {
  // gulp.watch('src/*.js', ['init']);
  var watcher = gulp.watch('src/*.js', ['make']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});
