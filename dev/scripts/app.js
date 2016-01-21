import Johnny from './modules/johnny';
import GarminNike from './modules/GarminNike';

class App {
  constructor(){
    let body = document.querySelector( 'body' );

    if( body.classList.contains( 'article' ) || body.classList.contains( 'home' ) ){
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
