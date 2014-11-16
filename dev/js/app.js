var Johnny = require( './modules/johnny' ),
	
App = function( window ){
	this.hdpi = ( window.matchMedia && window.matchMedia( '(min-resolution: 1.5dppx),(min-resolution: 144dpi),(-webkit-min-device-pixel-ratio: 1.5)' ).matches );
	this.touch = ( ( 'ontouchstart' in window ) || ( navigator.MaxTouchPoints > 0 ) || ( navigator.msMaxTouchPoints > 0 ) );
	this.bigScreen = ( window.matchMedia && window.matchMedia( '( min-width: 700px )' ).matches );
	this.isIE8 = document.all && !document.addEventListener ? true : false;
	
	this.johnny = new Johnny( this );
};

new App( window );