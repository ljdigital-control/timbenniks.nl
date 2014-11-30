var App = function( window ){
	this.touch = ( ( 'ontouchstart' in window ) || ( navigator.MaxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 ) );
	this.body = document.querySelector( 'body' );
	
	if( this.body.classList.contains( 'article' ) || this.body.classList.contains( 'home' ) ){
		var Johnny = require( './modules/johnny' );
		this.johnny = new Johnny( this );
	}

	if( this.body.classList.contains( 'marathon' ) ){
		console.log( 'marathon' );
	}
};

document.addEventListener( 'DOMContentLoaded', function(){
	new App( window );
} );