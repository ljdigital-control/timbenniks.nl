var gulp   = require( 'gulp' ),
    config = require( '../config' ),
    inlinesource = require( 'gulp-inline-source' );

gulp.task( 'inline', [ 'pages' ], function(){
  return gulp
    .src( config.dist + '*.html' )
    .pipe( inlinesource() )
    .pipe( gulp.dest( config.dist ) );
});