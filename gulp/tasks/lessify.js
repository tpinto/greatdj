
var gulp = require('gulp'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    handleErrors = require('../util/handleErrors'),
    bundleLogger = require('../util/bundleLogger');

gulp.task('lessify', function () {
  bundleLogger.start();

  gulp.src('./src/less/**/*.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/'))
    .on('end', bundleLogger.end);
});

