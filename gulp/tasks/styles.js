var gulp = require( 'gulp' ),
    config = require( '../config' ),
    plumber = require( 'gulp-plumber' ),
    stylus = require( 'gulp-stylus' ),
    autoprefixer = require( 'autoprefixer-stylus' ),
    rename = require( 'gulp-rename' );

gulp.task( 'styles', [ 'gitVersion' ], function(){
  gulp
    .src( [ config.dev + 'styles/*.styl', '!' + config.dev + 'styles/_*.styl', '!' ] )
    .pipe( plumber() )
    .pipe( stylus( {
      use: autoprefixer( { browsers: [ 'ie > 8', 'last 1 version'] } ),
      compress: false
    } ) )
    .pipe( rename( 'styles-' + config.gitVersion + '.css' ) )
    .pipe( gulp.dest( config.dist ) );
});
