var gulp   = require( 'gulp' ),
    config = require( '../config' ),
    minimist = require( 'minimist' ),
    args = minimist( process.argv.slice( 2 ) ),
    ftp = require( 'vinyl-ftp' ),
    gutil = require( 'gulp-util' );

gulp.task( 'deploy', function(){
  var remotePath = '/public/sites/www.timbenniks.nl';
  var conn = ftp.create({
    host: 'ftp.timbenniks.nl',
    user: args.user,
    password: args.password,
    log: gutil.log
  });

  return gulp.src( config.dist + '/**/*' )
    .pipe( conn.newer( remotePath ) )
    .pipe( conn.dest( remotePath ) );
});