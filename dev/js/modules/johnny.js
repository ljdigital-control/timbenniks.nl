var Johnny = function( app ){
	
	var path, 
		length,
	
	init = function(){
		path = document.querySelector( '.johnny path' );
		length = path.getTotalLength();
		
		reset();
		go();
	},

	reset = function(){
		path.classList.remove( 'go' );
		path.style.strokeDasharray = length + ' ' + length;
		path.style.strokeDashoffset = length;
		path.getBoundingClientRect();
	},

	go = function(){
		path.classList.add( 'go' );
		path.style.strokeDashoffset = '0';
	}

	init();
};

module.exports = Johnny;