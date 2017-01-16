//import Johnny from './modules/johnny';
import GarminNike from './modules/GarminNike';
import Navigation from './modules/Navigation';
import iFrame from './modules/iFrame';

class App {
  constructor(){
    //this.Johnny = new Johnny();
    this.GarminNike = new GarminNike();
    this.Navigation = new Navigation();
    this.iFrame = new iFrame();
  }
}

require( 'domready' )( function(){
  new App();
} );
