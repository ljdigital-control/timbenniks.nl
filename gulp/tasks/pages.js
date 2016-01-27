var gulp = require( 'gulp' ),
    config = require( '../config' ),
    jade = require( 'gulp-jade' ),
    data = require( '../../dev/assets/data.json' );

gulp.task( 'pages', [ 'gitVersion' ], function(){
  return gulp
    .src( config.dev + 'pages/*.jade' )
    .pipe( jade({
      pretty: false,
      locals: { pages: data, config: config }
    } ) )
    .pipe( gulp.dest( config.dist ) );
});
