var gulp   = require( 'gulp' ),
    config = require( '../config' ),
    git = require( 'gulp-git' ),
    Q = require( 'q' ),
    defer = Q.defer();

gulp.task( 'gitVersion', function(){
  git.exec( { args : 'rev-parse HEAD', quiet: true }, function( err, stdout ){
    config.gitVersion = stdout.substring( 0, 8 );
    defer.resolve();
  });

  return defer.promise;
});