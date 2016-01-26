class Johnny {

	constructor(){
		if( matchMedia( 'only screen and (max-width: 480px)' ).matches ){
			return;
		}

		this.path = document.querySelector( '.johnny path' );
		this.length = this.path.getTotalLength();

		this.reset();
		this.go();
	}

	reset(){
		this.path.classList.remove( 'go' );
		this.path.style.strokeDasharray = this.length + ' ' + this.length;
		this.path.style.strokeDashoffset = this.length;
		this.path.getBoundingClientRect();
	}

	go(){
		this.path.classList.add( 'go' );
		this.path.style.strokeDashoffset = '0';
	}
}

module.exports = Johnny;
