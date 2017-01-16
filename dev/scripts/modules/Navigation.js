class Navigation {
  constructor(){
    this.button = document.querySelector( '.hamburger' );
    this.nav = document.querySelector( '.main-nav' );
    this.innerNav = document.querySelector( '.navigation-body' );

    if( !this.button ){
      return;
    }

    this.button.addEventListener( 'click', ()=>{
      if( !this.button.classList.contains( 'is-active' ) ){
        this.activate();
      }
      else {
       this.deactivate(); 
      }
    }, false );
  }

  activate(){
    document.body.style.overflow = 'hidden';
    this.button.classList.add( 'is-active' );
    this.nav.classList.add( 'is-active' );
    this.innerNav.classList.add( 'is-active' );
  }
  
  deactivate(){
    document.body.style.overflow = 'auto';
    this.button.classList.remove( 'is-active' );
    this.nav.classList.remove( 'is-active' );
    this.innerNav.classList.remove( 'is-active' );
  }
}

module.exports = Navigation;
