import Johnny from './modules/johnny';
import GarminNike from './modules/GarminNike';

class App {
  constructor(){
    this.Johnny = new Johnny();
    this.GarminNike = new GarminNike();
  }
}

require( 'domready' )( function(){
  new App();
} );
