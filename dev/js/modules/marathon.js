var Chartist = require( 'chartist' ),
	GoogleMapsLoader = require( 'google-maps' ),
	heatMap = require( '../../assets/marathon/heatmap.json' ),
	totals = require( '../../assets/marathon/totals.json' ),
	runs = require( '../../assets/marathon/runs.json' ),
	
Marathon = function(){

	var heatMapData = [],

	init = function(){
		GoogleMapsLoader.LIBRARIES = [ 'visualization' ];
		GoogleMapsLoader.load(function( google ){

			for( var i = 0; i < heatMap.length; i++ ){
				heatMapData.push( new google.maps.LatLng( heatMap[ i ].lat, heatMap[ i ].lon ) )
			}

			google.maps.event.addDomListener( window, 'load', initializeMap );
		});

		console.log( totals, runs );

		// new Chartist.Line('.ct-chart', {
		// 	labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
		// 	series: [
		// 		[12, 9, 7, 8, 5],
		// 		[2, 1, 3.5, 7, 3],
		// 		[1, 3, 4, 5, 6]
		// 	]
		// });
	},

	initializeMap = function(){
		var map = document.getElementById( 'map' );

		var mapOptions = {
			zoom: 14,
			center: heatMapData[ 0 ],
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
		},

		map = new google.maps.Map( map, mapOptions ),
		pointArray = new google.maps.MVCArray( heatMapData ),
		heatmap = new google.maps.visualization.HeatmapLayer( { data: pointArray } );

		heatmap.setMap( map );

		heatmap.set( 'radius', 20 );
		heatmap.set( 'opacity', 0.7 );
	}

	init();
};

module.exports = Marathon;