var Johnny = require( './modules/johnny' ),

App = function( window ){
	var touch = ( ( 'ontouchstart' in window ) || ( navigator.MaxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 ) ),
		body = document.querySelector( 'body' );
	
	if( body.classList.contains( 'article' ) || body.classList.contains( 'home' ) ){
		var johnny = new Johnny();
	}
};

document.addEventListener( 'DOMContentLoaded', function(){
	new App( window );
} );