var gulp = require( 'gulp' ),
	jshint = require( 'gulp-jshint' ),
	stylus = require( 'gulp-stylus' ),
	jade = require( 'gulp-jade' ),
	nib = require( 'nib' ),
	browserSync = require( 'browser-sync' ),
	browserify = require( 'gulp-browserify' ),
	uglify = require( 'gulp-uglify' ),
	marked = require( 'marked' ),
	inlinesource = require( 'gulp-inline-source' ),
	download = require( 'gulp-download' ),
	rimraf = require('rimraf');

gulp.task( 'connect', function(){
    browserSync({
        server: {
            baseDir: "./publish"
        }
    });
});


gulp.task( 'serve', [ 'connect' ], function (){
	gulp.watch( [ 'dev/js/**/*' ], [ 'lint', 'scripts' ] );
	gulp.watch( [ 'dev/css/**/*.styl' ], [ 'styles' ] );
	gulp.watch( [ 'dev/assets/**/*' ], [ 'assets' ] );
	gulp.watch( [ 'dev/templates/*.jade' ], [ 'pages' ] );
});


gulp.task( 'styles', function(){
	gulp
		.src( [ 'dev/css/*.styl', '!dev/css/_*.styl' ] )
		.pipe( stylus( { use: nib() } ) )
		.pipe( gulp.dest( 'publish/css/' ) )
		.pipe( browserSync.reload( { stream: true } ) );
});


gulp.task( 'lint', function(){
	gulp
		.src( [ 'dev/js/*.js', 'dev/js/**/*.js', '!dev/js/helpers/*.js', '!dev/js/vendors/*.js', '!dev/js/modernizr.js' ] )
		.pipe( jshint() )
		.pipe( jshint.reporter( 'default' ) );
});


gulp.task( 'scripts', function(){
	gulp
		.src( 'dev/js/app.js' )
		.pipe( browserify( {
			insertGlobals: true,
			debug: false
		} ) )
		//.pipe( uglify() )
		.pipe( gulp.dest( 'publish/js' ) );
});


gulp.task( 'assets', function(){
	rimraf('publish/assets', function(){
		gulp
			.src( [ 'dev/assets/**/*' ] )
			.pipe( gulp.dest( 'publish/assets' ) );
	});
});


gulp.task( 'pages', function(){
	gulp
		.src( 'dev/templates/*.jade' )
		.pipe( jade( { pretty: true } ) )
		.pipe( gulp.dest( 'publish' ) );
});


gulp.task( 'inline', [ 'pages' ], function(){
    gulp
		.src('publish/*.html')
		.pipe( inlinesource() )
		.pipe( gulp.dest('publish') );
});

gulp.task( 'build', [ 'styles', 'scripts', 'assets', 'pages', 'inline' ] );
