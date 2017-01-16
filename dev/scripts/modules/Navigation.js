class Navigation {
  constructor(){
    this.button = document.querySelector( '.hamburger' );
    this.nav = document.querySelector( '.main-nav' );
    this.innerNav = document.querySelector( '.navigation-body' );

    let body = document.body,
        html = document.documentElement;

    this.docHeight = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );

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
    this.button.classList.add( 'is-active' );
    this.nav.classList.add( 'is-active' );
    this.innerNav.classList.add( 'is-active' );
    setTimeout( ()=>{
      this.nav.style.height = `${this.docHeight}px`;
    }, 300 );
  }
  
   deactivate(){
    //document.body.style.overflow = 'auto';
    this.button.classList.remove( 'is-active' );
    this.nav.classList.remove( 'is-active' );
    this.innerNav.classList.remove( 'is-active' );
  }
}

module.exports = Navigation;
