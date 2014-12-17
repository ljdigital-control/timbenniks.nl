var Marathon = require( './modules/marathon' ),
	Johnny = require( './modules/johnny' ),

App = function( window ){
	var touch = ( ( 'ontouchstart' in window ) || ( navigator.MaxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 ) ),
		body = document.querySelector( 'body' );
	
	if( body.classList.contains( 'article' ) || body.classList.contains( 'home' ) ){
		var johnny = new Johnny();
	}

	if( body.classList.contains( 'marathon' ) ){
		var marathon = new Marathon();
	}
};

document.addEventListener( 'DOMContentLoaded', function(){
	new App( window );
} );