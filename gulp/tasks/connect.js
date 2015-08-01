var gulp = require( 'gulp' ),
    config = require( '../config' ),
    express = require( 'express' ),
    app = express();

gulp.task( 'connect', function(){
  app.use( express.static( config.server.baseDir ) );
  app.listen( config.server.port );
});
