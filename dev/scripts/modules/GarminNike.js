/* globals google */
import GoogleMapsLoader from 'google-maps';
import GPX from '../helpers/GPX';

class GarminNike {

  constructor(){
    GoogleMapsLoader.LIBRARIES = [ 'visualization' ];
    GoogleMapsLoader.KEY = 'AIzaSyBom_Va46C1Qh66p6d4e9QWd8J7U6oMElM';

    GoogleMapsLoader.load( ( google )=> {
      google.maps.event.addDomListener( window, 'load', this.initializeMap.bind( this ) );
    });
  }

  initializeMap(){
    let map = document.getElementById( 'map' ),
        mapOptions = {
          zoom: 15,
          center: { lat: 48.835579, lng: 2.321400 },
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

    this.plotGPXData( '/assets/garmin-nike/activity_849956023.gpx', 'garmin' );
    this.plotGPXData( '/assets/garmin-nike/timbenniks_2015_07_27.gpx', 'nike' );
  }

  plotGPXData( url, type ){
    GPX
      .get( url )
      .then( ( gpxContents ) => {
        this.plotRouteOnMap( GPX.parse( gpxContents ), type );
      } );
  }

  plotRouteOnMap( geoJSON, type ){

    if( type === 'nike' ){
      let nike = new google.maps.Data();
      nike.addGeoJson( geoJSON );
      nike.setStyle({
        strokeColor: '#000000',
        strokeWeight: 2,
        strokeOpacity: 0.7
      });

      nike.setMap( this.map );
    }

    if( type === 'garmin' ){
      let garmin = new google.maps.Data();
      garmin.addGeoJson( geoJSON );
      garmin.setStyle({
        strokeColor: '#9c0001',
        strokeWeight: 2,
        strokeOpacity: 0.7
      });

      garmin.setMap( this.map );
      this.zoomMapToBounds( garmin );
    }
  }

  zoomMapToBounds( datapoint ){
    var bounds = new google.maps.LatLngBounds();

    datapoint.forEach( function( feature ){
      this.processPoints( feature.getGeometry(), bounds.extend, bounds );
    }.bind( this ));

    this.map.fitBounds( bounds );
  }

  processPoints( geometry, callback, thisArg ){

    if( geometry instanceof google.maps.LatLng ){
      callback.call( thisArg, geometry );
    }

    else if( geometry instanceof google.maps.Data.Point ){
      callback.call( thisArg, geometry.get() );
    }

    else {
      geometry.getArray().forEach( function( g ){
        this.processPoints( g, callback, thisArg );
      }.bind( this ));
    }

  }
}

module.exports = GarminNike;
