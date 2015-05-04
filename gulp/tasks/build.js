var gulp = require('gulp');

global.isStaging = false;
gulp.task('build', ['lessify', 'browserify-react-prod']);