<?php
$file = $_GET[ 'file' ];
$ext = $_GET[ 'ext' ];
$filename = $file.'.'.$ext;

header( 'Date: ' . gmdate( 'D, d M Y H:i:s GMT' ) );
header( 'Expires: ' . gmdate( 'D, d M Y H:i:s', strtotime( '+ 10 years' ) ) . ' GMT' );
header( 'Last-Modified: ' . gmdate( 'D, d M Y H:i:s', filemtime( $filename ) ) . ' GMT' );
header( 'Cache-Control: public, max-age=315360000' );
header( 'Pragma: ' );

if( $ext == 'css' ){
  header( 'Content-type: text/css; charset=utf-8' );
}
elseif( $ext == 'js' ){
  header( 'Content-type: application/x-javascript; charset=utf-8' );
}
else {
	header( 'Content-type: text/html; charset=utf-8' );
}

function make_gzip( $source ){
	if( !headers_sent() && extension_loaded( "zlib" ) && strstr( $_SERVER[ "HTTP_ACCEPT_ENCODING" ], "gzip" ) ){
		$source = gzencode( $source, 9 );

		header( "Content-Encoding: gzip" );
		header( "Vary: Accept-Encoding" );
		header( "Content-Length: ".strlen( $source ) );

		return $source;
	}
}

if( file_exists( $file.'.'.$ext ) ){
  echo make_gzip( file_get_contents( $file.'.'.$ext ) );
}

?>