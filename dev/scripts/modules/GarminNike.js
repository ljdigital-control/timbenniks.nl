/* globals google */
import GoogleMapsLoader from 'google-maps';
import GPX from '../helpers/GPX';
import Chartist from 'chartist';
import Q from 'q';

class GarminNike {

  constructor(){

    // settings
    GoogleMapsLoader.KEY = 'AIzaSyBom_Va46C1Qh66p6d4e9QWd8J7U6oMElM';

    let set1 = [{
      url: '/assets/garmin-nike/activity_854027028.gpx',
      type: 'garmin',
      styles: {
        strokeColor: '#9c0001',
        strokeWeight: 2,
        strokeOpacity: 0.7
      }
    },{
      url: '/assets/garmin-nike/timbenniks_2015_08_03.gpx',
      type: 'nike',
      styles: {
        strokeColor: '#000000',
        strokeWeight: 2,
        strokeOpacity: 0.7
      }
    }];

    this.data = [ set1 ];

    this.mapOptions = {
      zoom: 15,
      center: { lat: 48.82803626209759, lng: 2.3226445449829303 },
      styles: [{"featureType":"water","stylers":[{"color":"#e5dada"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}],
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      scrollwheel: false
    };

    // initialize the map
    GoogleMapsLoader.load( ( google )=> {
      google.maps.event.addDomListener( window, 'load', this.initializeMap.bind( this ) );
    });
  }

  initializeMap(){
    // map building
    this.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.mapOptions.zoomControlOptions = { style: google.maps.ZoomControlStyle.SMALL };
    this.map = new google.maps.Map( document.getElementById( 'map' ), this.mapOptions );

    // plot the data
    this.getData( 0 ).then( ( set ) => {
      this.data[ set ].forEach( ( item ) => {
        this.plotRouteOnMap( item );
      } );
    } );
  }

  getData( set )  {
    let deferred = Q.defer();

    this.data[ set ].forEach( ( item, index ) => {
      GPX
        .get( item.url )
        .then( ( gpxContents ) => {
          // enriching dataset
          this.data[ set ][ index ].geoJSON = GPX.toGeoJSON( gpxContents );
          this.data[ set ][ index ].elevation = GPX.elevation( gpxContents );

          if( index === 1 ){
            deferred.resolve( set );
          }
        });
    });

    return deferred.promise;
  }

  plotRouteOnMap( data ){
    let mapData = new google.maps.Data();

    mapData.addGeoJson( data.geoJSON );
    mapData.setStyle( data.styles );
    mapData.setMap( this.map );
  }

  zoomMapToBounds( datapoints ){
    var bounds = new google.maps.LatLngBounds();

    datapoints.forEach( ( feature ) => {
      this.processPoints( feature.getGeometry(), bounds.extend, bounds );
    } );

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
      geometry.getArray().forEach( ( g ) => {
        this.processPoints( g, callback, thisArg );
      } );
    }

  }
}

module.exports = GarminNike;
