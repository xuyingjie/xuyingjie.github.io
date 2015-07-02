var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var babel = require('gulp-babel');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('make', function() {
  return gulp.src(['js/*.js'])
    .pipe(babel())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('.'))
    .pipe(rename('app.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('sass', function() {
  return gulp.src('sass/app.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('.'));
});

gulp.task('default', ['sass', 'make'], function() {
  gulp.watch('sass/app.scss', ['sass']);
  var watcher = gulp.watch('js/*.js', ['make']);
  watcher.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
});
