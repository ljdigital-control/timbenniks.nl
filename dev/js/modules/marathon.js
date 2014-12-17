var d3 = require( 'd3' ),
	c3 = require( 'c3' ),

Marathon = function(){

	var init = function(){

		var chart = c3.generate( {
			bindto: '.chart',
			data: {
    			url: '/assets/marathon/runs.json',
    			mimeType: 'json',
    			type: 'spline',
    			keys: {
                	value: ['distance']
            	}
            },
			size: {
				width: 900
			}
		});

	};

	init();
};

module.exports = Marathon;