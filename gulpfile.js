var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat');
var babel = require('gulp-babel');

gulp.task('default', function() {
  // place code for your default task here
  return gulp.src(
    [
      'build/conf.js',
      'build/navbar.js',
      'build/contents.js',
      'build/section.js',
      'build/signin.js',
      'build/signup.js',
      'build/editor.js',
      'build/folder.js',
      'build/tasks.js',
      'build/root.js'
    ])
    .pipe(babel())
    .pipe(jshint())
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('.'));
});
