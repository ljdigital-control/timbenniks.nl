var gulp = require( 'gulp' ),
    config = require( '../config' );

gulp.task( 'copy', function(){
  gulp
    .src( [ config.dev + '/*.txt', config.dev + '/*.xml', config.dev + '/.htaccess', config.dev + '/static.php' ] )
    .pipe( gulp.dest( config.dist ) );
});
