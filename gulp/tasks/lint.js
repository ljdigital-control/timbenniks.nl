var gulp = require( 'gulp' ),
    config = require( '../config' ),
    jshint = require( 'gulp-jshint' ),
    stylish = require( 'jshint-stylish' );

gulp.task( 'lint', function(){
  gulp
    .src( [ config.dev + 'scripts/*.js', config.dev + 'scripts/**/*.js', '!' + config.dev + 'scripts/helpers/*.js', '!' + config.dev + 'scripts/vendor/*.js', '!' + config.dev + 'scripts/modernizr.js' ] )
    .pipe( jshint() )
    .pipe( jshint.reporter( stylish ) );
});
