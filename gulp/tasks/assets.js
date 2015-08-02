var gulp = require( 'gulp' ),
    config = require( '../config' ),
    imagemin = require( 'gulp-imagemin' );

gulp.task( 'assets', function(){
  gulp
    .src( [ config.dev + 'assets/**/*.svg' ] )
    .pipe( gulp.dest( config.dist + 'assets' ) );

  gulp
    .src( [ config.dev + 'assets/**/*.gpx' ] )
    .pipe( gulp.dest( config.dist + 'assets' ) );

  gulp
    .src( [ config.dev + 'assets/**/*', '!' + config.dev + 'assets/**/*.svg', '!' + config.dev + 'assets/**/*.gpx' ] )
    .pipe( imagemin( {
      progressive: true
    } ) )
    .pipe( gulp.dest( config.dist + 'assets' ) );
});
