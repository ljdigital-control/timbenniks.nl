var gulp = require( 'gulp' ),
    requireDir = require( 'require-dir' );

requireDir('./tasks', { recurse: true });

gulp.task( 'build', [ 'styles', 'scripts', 'assets', 'pages', 'copy' ] );
gulp.task( 'work', [ 'connect', 'sync', 'watch' ] );
gulp.task( 'default', [ 'build', 'work' ] );

gulp.task( 'release', [ 'styles', 'scripts_release', 'assets', 'pages', 'copy' ] );
