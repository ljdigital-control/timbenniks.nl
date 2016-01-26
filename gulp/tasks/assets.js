var gulp = require( 'gulp' ),
    config = require( '../config' );
    
gulp.task( 'assets', function(){
  gulp
    .src( [ config.dev + 'assets/**/*' ] )
    .pipe( gulp.dest( config.dist + 'assets' ) );
});
