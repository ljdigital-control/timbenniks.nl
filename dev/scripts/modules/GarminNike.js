/* globals google */
import GoogleMapsLoader from 'google-maps';
import GPX from '../helpers/GPX';
import Q from 'q';
import sets from '../../assets/garmin-nike/sets.json';

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

    this.setDataset( 0 );

    this.dropdownSelector = document.querySelector( '[name="set"]' );
    this.dropdownSelector.addEventListener( 'change', this.changeDataset.bind( this ), false );

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

    this.changeDataset();
  }

  getData() {
    let deferred = Q.defer();

    this.data[ 0 ].forEach( ( item, index ) => {
      GPX
        .get( item.url )
        .then( ( gpxContents ) => {
          // enriching dataset
          this.data[ 0 ][ index ].geoJSON = GPX.toGeoJSON( gpxContents );
          this.data[ 0 ][ index ].elevation = GPX.elevation( gpxContents );
          this.data[ 0 ][ index ].mapData = new google.maps.Data();
          this.data[ 0 ][ index ].features = null;

          if( index === this.data[ 0 ].length - 1 ){
            deferred.resolve( this.data[ 0 ] );
          }
        });
    });

    return deferred.promise;
  }

  setDataset( index ){
    this.data = [ sets[ index ] ];
  }

  changeDataset( e ){
    let set = 0;

    if( e && e.target ){
      set = e.target.value;
    }

    this.setDataset( set );

    this.getData().then( ( d ) => {

      d.forEach( ( data, index ) => {
        this.plotRouteOnMap( index );
      } );
    } );
  }

  plotRouteOnMap( index ){

    if( this.data[ 0 ][ index ].features !== null ){
      this.data[ 0 ][ index ].features.forEach( ( feature ) => {
        this.map.data.remove( feature );
      } );
    }

    this.data[ 0 ][ index ].features = this.data[ 0 ][ index ].mapData.addGeoJson( this.data[ 0 ][ index ].geoJSON );
    this.data[ 0 ][ index ].mapData.setStyle( this.data[ 0 ][ index ].styles );
    this.data[ 0 ][ index ].mapData.setMap( this.map );

    this.zoomMapToBounds( this.data[ 0 ][ index ].mapData );
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
