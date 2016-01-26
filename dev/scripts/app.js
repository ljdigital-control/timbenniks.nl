import Johnny from './modules/johnny';
import GarminNike from './modules/GarminNike';

class App {
  constructor(){
    const body = document.querySelector( 'body' );

    if( body.classList.contains( 'article' ) || body.classList.contains( 'home' ) && matchMedia( 'only screen and (min-width: 480px)' ).matches ){
      new Johnny();
    }

    if( body.classList.contains( 'garmin-nike' ) ){
      new GarminNike();
    }
  }
}

require( 'domready' )( function(){
  new App();
} );
