var gulp = require( 'gulp' ),
    config = require( '../config' ),
    jade = require( 'gulp-jade' );

gulp.task( 'pages', function(){

  return gulp
          .src( config.dev + 'pages/*.jade' )
          .pipe( jade({
            pretty: true
          } ) )
          .pipe( gulp.dest( config.dist ) );
});
