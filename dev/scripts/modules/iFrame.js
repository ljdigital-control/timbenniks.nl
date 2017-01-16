/* globals Waypoint */
require( '../../../node_modules/waypoints/lib/noframework.waypoints.js' );

class iFrame {
  constructor(){
    this.frames = document.querySelectorAll( 'iframe[data-src]' );
    var that = this;

    for( var i = this.frames.length - 1; i >= 0; i-- ){
      new Waypoint({
        element: this.frames[ i ],
        handler: function(){
          that.activate( this.element );
        },
        offset: '80%'
      });
    }    
  }

  activate( element ){
    if( !element.getAttribute( 'data-active' ) ){
      element.src = element.getAttribute( 'data-src' );
      element.setAttribute( 'data-active', true );
    }
  }
}

module.exports = iFrame;