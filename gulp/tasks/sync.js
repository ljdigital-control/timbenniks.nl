var gulp = require( 'gulp' ),
    config = require( '../config' ),
    browserSync = require( 'browser-sync' );

gulp.task('sync', function() {

  var syncConfig = {
    server: {
      baseDir: config.server.baseDir,
      index: config.server.index,
      host: config.server.host
    },
    files: config.server.sync.files,
    port: config.server.port,
    browser: config.server.sync.browser,
    notify: config.server.sync.notify,
    reloadDelay: config.server.sync.reloadDelay,
    minify: config.server.sync.minify,
    notify: config.server.sync.notify
  }

  browserSync( syncConfig );
} );
