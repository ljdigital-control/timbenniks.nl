var gulp = require( 'gulp' ),
    config = require( '../config' ),
    jade = require( 'gulp-jade' );

gulp.task( 'pages', [ 'gitVersion' ], function(){

  return gulp
    .src( config.dev + 'pages/*.jade' )
    .pipe( jade({
      pretty: false,
      locals: config
    } ) )
    .pipe( gulp.dest( config.dist ) );
});
