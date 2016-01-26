var gulp = require( 'gulp' ),
    config = require( '../config' ),
    rimraf = require( 'rimraf' ),
    Q = require( 'q' ),
    defer = Q.defer();

gulp.task( 'clean', function(){
  rimraf( config.dist, function(){
    defer.resolve();
  } );
  return defer.promise;
} );
