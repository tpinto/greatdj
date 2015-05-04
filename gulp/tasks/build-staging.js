var gulp = require('gulp');

global.isStaging = true;
gulp.task('build-staging', ['lessify', 'browserify-react']);