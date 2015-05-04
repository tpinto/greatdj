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
var reactify     = require('reactify');

gulp.task('browserify-react', function() {

  var fn = (global.isWatching) ? watchify : function(fn){ return fn; };

  var entries = ['./src/app.js'];
  if(global.isStaging) entries.unshift('./src/staging.js');

  var bundler = fn(browserify({
    transform: ['babelify'],
    entries: entries,
    extensions: ['.js', '.jsx'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));


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