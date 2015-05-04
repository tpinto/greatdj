/* browserify task
   ---------------
   Bundle javascripty things with browserify!

   If the watch task is running, this uses watchify instead
   of browserify for faster bundling using caching.
*/

var browserify   = require('browserify');
var watchify     = require('watchify');
var bundleLogger = require('../util/bundleLogger');
var gulp         = require('gulp');
var handleErrors = require('../util/handleErrors');
var source       = require('vinyl-source-stream');
var buffer       = require('vinyl-buffer');
var uglify       = require('gulp-uglify');
var sourcemaps   = require('gulp-sourcemaps');

gulp.task('browserify-react-prod', function() {
  var fn = (global.isWatching) ? watchify : function(fn){ return fn; },
      browserifyOpts = {
    transform: ['babelify'],
    entries: ['./src/app.js'],
    extensions: ['.js', '.jsx'],
    debug: false,
    cache: {},
    packageCache: {},
    fullPaths: true
  };

  var bundler = fn(browserify(browserifyOpts));

  var bundle = function() {
    // Log when bundling starts
    bundleLogger.start();

    return bundler
      .bundle()
      // Report compile errors
      .on('error', handleErrors)
      // Use vinyl-source-stream to make the
      // stream gulp compatible. Specifiy the
      // desired output filename here.
      .pipe(source('app.js'))

      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
          // Add transformation tasks to the pipeline here.
          .pipe(uglify())
          .on('error', handleErrors)

      .pipe(sourcemaps.write('./'))

      // Specify the output destination
      .pipe(gulp.dest('./dist/'))
      // Log when bundling completes!
      .on('end', bundleLogger.end);
  };

  if(global.isWatching) {
    // Rebundle with watchify on changes.
    bundler.on('update', bundle);
  }

  return bundle();
});