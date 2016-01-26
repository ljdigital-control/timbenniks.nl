var gulp = require( 'gulp' ),
    config = require( '../config' ),
    browserify = require( 'gulp-browserify' ),
    uglify = require( 'gulp-uglify' ),
    plumber = require( 'gulp-plumber' ),
    sourcemaps = require( 'gulp-sourcemaps' ),
    babelify = require( 'babelify' ),
    jadeify = require( 'jadeify' ),
    rename = require( 'gulp-rename' );

gulp.task( 'scripts', [ 'gitVersion' ], function(){
  gulp
    .src( config.dev + 'scripts/app.js' )
    .pipe( plumber() )
    .pipe( browserify( {
      insertGlobals: true,
      transform: [ 'babelify', 'jadeify' ],
      debug: true
    } ) )
    .pipe( sourcemaps.init({
        loadMaps: true
    } ) )
    .pipe( sourcemaps.write( './' ) )
    .pipe( rename( 'app-' + config.gitVersion + '.js' ) )
    .pipe( gulp.dest( config.dist ) );
});

gulp.task( 'scripts_release', [ 'gitVersion' ], function(){
  gulp
    .src( config.dev + 'scripts/app.js' )
    .pipe( browserify( {
      insertGlobals: true,
      transform: [ 'babelify', 'jadeify' ],
      debug: false
    } ) )
    .pipe( uglify() )
    .pipe( rename( 'app-' + config.gitVersion + '.js' ) )
    .pipe( gulp.dest( config.dist ) );
});
