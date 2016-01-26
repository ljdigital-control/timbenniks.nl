var gulp = require( 'gulp' ),
    requireDir = require( 'require-dir' );

requireDir('./tasks', { recurse: true });

gulp.task( 'build', [ 'clean', 'styles', 'scripts', 'assets', 'pages', 'copy' ] );
gulp.task( 'work', [ 'connect', 'sync', 'watch' ] );
gulp.task( 'release', [ 'clean', 'styles', 'scripts_release', 'assets', 'pages', 'copy' ] );

gulp.task( 'default', [ 'build', 'work' ] );