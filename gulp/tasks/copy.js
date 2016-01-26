var gulp = require( 'gulp' ),
    config = require( '../config' );

gulp.task( 'copy', function(){
  gulp
    .src( [ config.dev + '/*.txt', config.dev + '/*.xml', config.dev + '/.htaccess' ] )
    .pipe( gulp.dest( config.dist ) );
});
