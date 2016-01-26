/* globals google */
import GoogleMapsLoader from 'google-maps';
import GPX from '../helpers/GPX';
import Q from 'q';
import sets from '../../assets/garmin-nike/sets.json';
import runDataTmpl from '../../assets/garmin-nike/run_data.jade';

class GarminNike {

  constructor(){
    // settings
    GoogleMapsLoader.KEY = 'AIzaSyBom_Va46C1Qh66p6d4e9QWd8J7U6oMElM';

    this.mapOptions = {
      zoom: 15,
      styles: [{"featureType":"water","stylers":[{"color":"#e5dada"},{"visibility":"on"}]},{"featureType":"landscape","stylers":[{"color":"#f2f2f2"}]},{"featureType":"road","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]}],
      panControl: false,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      overviewMapControl: false,
      scrollwheel: false
    };

    this.data = sets;

    if( document.body.classList.contains( 'garmin-nike' ) ){
      document.querySelector( '[name="set"]' ).addEventListener( 'change', this.changeDataset.bind( this ), false );

      // initialize the map
      GoogleMapsLoader.load( ( google )=> {
        google.maps.event.addDomListener( window, 'load', this.initializeMap.bind( this ) );
      });
    }
  }

  initializeMap(){

    // map building
    this.mapOptions.mapTypeId = google.maps.MapTypeId.ROADMAP;
    this.mapOptions.zoomControlOptions = { style: google.maps.ZoomControlStyle.SMALL };
    this.map = new google.maps.Map( document.getElementById( 'map' ), this.mapOptions );

    this.enrichData().then( ()=>{
      this.plotSetOnMap( 'set1' );
    } );
  }

  enrichData(){
    const promises = [];
    let deferred = Q.defer();

    for( let set in this.data ){
      for( let type in this.data[ set ] ){
        promises.push( GPX.get( this.data[ set ][ type ].url ).then( ( gpxContent )=> {
          let distance = GPX.distance( gpxContent ),
              duration = GPX.duration( gpxContent ),
              pace = GPX.pace( duration.total, distance );

          this.data[ set ][ type ].gpx = gpxContent;
          this.data[ set ][ type ].geoJSON = GPX.toGeoJSON( gpxContent );
          this.data[ set ][ type ].elevation = GPX.elevation( gpxContent );
          this.data[ set ][ type ].distance = distance;
          this.data[ set ][ type ].duration = duration;
          this.data[ set ][ type ].pace = pace;
          this.data[ set ][ type ].features = null;
          this.data[ set ][ type ].mapData = new google.maps.Data();
        } ) );
      }
    }

    Q.allSettled( promises ).then( ( promiseResults )=> {
      for ( let result in promiseResults ){
        if( promiseResults[ result ].state === 'rejected' ){
          deferred.reject( 'Could not get all data' );
        }
      }

      deferred.resolve( this.data );
    } );

    return deferred.promise;
  }

  changeDataset( e ){
    this.deleteDataFromMap();
    this.plotSetOnMap( e.target.value );  
  }

  deleteDataFromMap(){
    for( let set in this.data ){
      for( let item in this.data[ set ] ){
        if( this.data[ set ][ item ].features ){
          this.data[ set ][ item ].mapData.setMap( null );
        }
      }
    }
  }

  plotSetOnMap( set ){  
    for( let item in this.data[ set ] ){
      this.data[ set ][ item ].features = this.data[ set ][ item ].mapData.addGeoJson( this.data[ set ][ item ].geoJSON );
      this.data[ set ][ item ].mapData.setStyle( this.data[ set ][ item ].styles );
      this.data[ set ][ item ].mapData.setMap( this.map );   
    }

    this.zoomMapToBounds( this.data[ set ][ 0 ].mapData );

    document.querySelector( '.run-data' ).innerHTML = runDataTmpl({
      runs: this.data[ set ]
    });
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
