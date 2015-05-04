var gulp = require('gulp');

global.isStaging = true;
gulp.task('build', ['lessify', 'browserify-react']);