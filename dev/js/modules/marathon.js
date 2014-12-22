var Chartist = require( 'chartist' ),
	
Marathon = function(){

	var init = function(){

		new Chartist.Line('.ct-chart', {
			labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
			series: [
				[12, 9, 7, 8, 5],
				[2, 1, 3.5, 7, 3],
				[1, 3, 4, 5, 6]
			]
		});
	};

	init();
};

module.exports = Marathon;