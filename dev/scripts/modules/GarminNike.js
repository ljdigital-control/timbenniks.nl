/* globals google */
import GoogleMapsLoader from 'google-maps';

class GarminNike {

  constructor(){
    GoogleMapsLoader.LIBRARIES = [ 'visualization' ];
    GoogleMapsLoader.load( ( google )=> {
      google.maps.event.addDomListener( window, 'load', this.initializeMap );
    });
  }

  initializeMap(){
    let map = document.getElementById( 'map' ),
        mapOptions = {
          zoom: 14,
          //center: heatMapData[ 0 ],
          styles: [{"featureType":"water","stylers":[{"color":"#e5dada"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}],
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          panControl: false,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          overviewMapControl: false,
          scrollwheel: false,
          zoomControlOptions: {
            style: google.maps.ZoomControlStyle.SMALL
          }
      };

    this.map = new google.maps.Map( map, mapOptions );
  }

}

module.exports = GarminNike;
