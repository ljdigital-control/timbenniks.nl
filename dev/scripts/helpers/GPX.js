import request from 'superagent';
import Q from 'q';
import toGeoJSON from './togeojson';

class GPX {

  static get( gpx ){
    var deferred = Q.defer();

    request
      .get( gpx )
      .accept( 'application/gpx+xml' )
      .end( function( error, result ){
        if( error ){
          deferred.reject( 'Couldn not download: ' + gpx );
        }
        else {
          deferred.resolve( result.text );
        }
      } );

    return deferred.promise;
  }

  static elevation( data ){
    let parser = new DOMParser(),
        xmlDoc = parser.parseFromString( data, 'application/xml' ),
        elevation = [];

    [].forEach.call( xmlDoc.querySelectorAll( 'trkpt' ), ( point )=> {
      elevation.push( point.querySelector( 'ele' ).textContent );
    });

    return elevation;
  }

  static toGeoJSON( data ){
    let parser = new DOMParser(),
        xmlDoc = parser.parseFromString( data, 'application/xml' );

    return toGeoJSON.gpx( xmlDoc );
  }
}

module.exports = GPX;
