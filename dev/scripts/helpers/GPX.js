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
          deferred.reject( 'Could not download: ' + gpx );
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
        elevation = [],
        waypoints = xmlDoc.querySelectorAll( 'trkpt' ),
        dp = 0, dm = 0;

    for( let i = 0; i < waypoints.length - 1; i++ ){
      let diff = parseFloat( waypoints[ i + 1 ].querySelector( 'ele' ).textContent ) - parseFloat( waypoints[ i ].querySelector( 'ele' ).textContent );

      if( diff < 0 ){
        dm += diff;
      } 
      
      if( diff > 0 ){
        dp += diff;
      }

      elevation.push( parseFloat( waypoints[ i ].querySelector( 'ele' ).textContent ) );
    }

    return {
      'elevation': elevation,
      'max': Math.max.apply( null, elevation ),
      'min': Math.min.apply( null, elevation ),
      'diff-': dm,
      'diff+': dp
    }
  }

  static distance( data ){
    let parser = new DOMParser(),
        xmlDoc = parser.parseFromString( data, 'application/xml' ),
        waypoints = xmlDoc.querySelectorAll( 'trkpt' ),
        distance = 0,
        calcDistanceBetweenPoints = function( wp1, wp2 ){
          let point1 = {
            lat: parseFloat( wp1.getAttribute( 'lat' ) ) * ( Math.PI / 180 ),
            lon: parseFloat( wp1.getAttribute( 'lon' ) ) * ( Math.PI / 180 ),
            alt: parseFloat( wp1.querySelector( 'ele' ).textContent ) / 1000
          },
          point2 = {
            lat: parseFloat( wp2.getAttribute( 'lat' ) ) * ( Math.PI / 180 ),
            lon: parseFloat( wp2.getAttribute( 'lon' ) ) * ( Math.PI / 180 ),
            alt: parseFloat( wp2.querySelector( 'ele' ).textContent ) / 1000
          },
          dp = 2 * Math.asin( Math.sqrt( Math.pow( Math.sin( ( point1.lat - point2.lat ) / 2 ), 2 ) + Math.cos( point1.lat ) * Math.cos( point2.lat ) * Math.pow( Math.sin( ( point1.lon - point2.lon ) / 2 ), 2 ) ) ),
          d = dp * 6366,
          h = Math.sqrt( Math.pow( d, 2 ) + Math.pow( point2.alt - point1.alt, 2 ) );

          return h;
        };

    for( let i = 0; i < waypoints.length - 1; i++ ){
      distance += calcDistanceBetweenPoints( waypoints[ i ], waypoints[ i + 1 ] );
    }

    return distance;
  }

  static toGeoJSON( data ){
    let parser = new DOMParser(),
        xmlDoc = parser.parseFromString( data, 'application/xml' );

    return toGeoJSON.gpx( xmlDoc );
  }
}

module.exports = GPX;
