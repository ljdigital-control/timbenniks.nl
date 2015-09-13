const _MAX_POINT_INTERVAL_MS = 15000;
const _SECOND_IN_MILLIS = 1000;
const _MINUTE_IN_MILLIS = 60 * _SECOND_IN_MILLIS;
const _HOUR_IN_MILLIS = 60 * _MINUTE_IN_MILLIS;
const _DEFAULT_GPX_OPTS = {
  parseElements: ['track', 'route']
};

class GPX {

  constructor( gpx, options ){

    this.options = {
      max_point_interval: _MAX_POINT_INTERVAL_MS,
      gpx_options: _DEFAULT_GPX_OPTS
    };

    this.gpx = gpx;
    this.layers = {};

    this.info = {
      name: null,
      length: 0.0,
      elevation: {
        gain: 0.0,
        loss: 0.0,
        points: []
      },

      hr: {
        avg: 0,
        total: 0,
        points: []
      },

      duration: {
        start: null,
        end: null,
        moving: 0,
        total: 0
      }
    };

    this.parse();
  }

  parse(){
    let parser = new DOMParser(),
        xmlDoc = parser.parseFromString( this.gpx, 'application/xml' );

    this.parse_gpx_data( xmlDoc );
  }

  parse_gpx_data( xml ) {
    let j, i, el,
        tags = [],
        parseElements = this.options.gpx_options.parseElements;

    if( parseElements.indexOf( 'route' ) > -1 ){
      tags.push( [ 'rte', 'rtept' ] );
    }

    if( parseElements.indexOf( 'track' ) > -1 ){
      tags.push( [ 'trkseg', 'trkpt' ] );
    }

    var name = xml.getElementsByTagName( 'name' );
    if( name.length > 0 ){
      this.info.name = name[ 0 ].textContent;
    }

    var desc = xml.getElementsByTagName( 'desc' );
    if( desc.length > 0 ){
      this.info.desc = desc[ 0 ].textContent;
    }

    var author = xml.getElementsByTagName( 'author' );
    if( author.length > 0 ){
      this.info.author = author[ 0 ].textContent;
    }

    var copyright = xml.getElementsByTagName( 'copyright' );
    if( copyright.length > 0 ){
      this.info.copyright = copyright[ 0 ].textContent;
    }

    for( j = 0; j < tags.length; j++ ){

      el = xml.getElementsByTagName( tags[ j ][ 0 ] );

      for( i = 0; i < el.length; i++ ){

        var coords = this.parse_trkseg( el[ i ], xml, options, tags[ j ][ 1 ] );

        if( coords.length === 0 ){
          continue;
        }

      }

    }

    this.info.hr.avg = Math.round( this.info.hr._total / this.info.hr.points.length );
  }

  parse_trkseg( line, xml, options, tag ){
    var el = line.getElementsByTagName( tag );

    if( !el.length ){
      return [];
    }

    var coords = [];
    var last = null;

    for( var i = 0; i < el.length; i++ ){

      var _,
        ll = new L.LatLng( el[i].getAttribute('lat'), el[i].getAttribute('lon'));

      ll.meta = { time: null, ele: null, hr: null };

      _ = el[i].getElementsByTagName('time');
      if (_.length > 0) {
        ll.meta.time = new Date(Date.parse(_[0].textContent));
      }

      _ = el[i].getElementsByTagName('ele');
      if (_.length > 0) {
        ll.meta.ele = parseFloat(_[0].textContent);
      }

      _ = el[i].getElementsByTagNameNS('*', 'hr');
      if (_.length > 0) {
        ll.meta.hr = parseInt(_[0].textContent);
        this._info.hr._points.push([this._info.length, ll.meta.hr]);
        this._info.hr._total += ll.meta.hr;
      }

      this._info.elevation._points.push([this._info.length, ll.meta.ele]);
      this._info.duration.end = ll.meta.time;

      if (last != null) {
        this._info.length += this._dist3d(last, ll);

        var t = ll.meta.ele - last.meta.ele;
        if (t > 0){ this._info.elevation.gain += t;}
        else{
         this._info.elevation.loss += Math.abs(t);
        }

        t = Math.abs(ll.meta.time - last.meta.time);
        this._info.duration.total += t;
        if (t < options.max_point_interval) {this._info.duration.moving += t;}
      } else {
        this._info.duration.start = ll.meta.time;
      }

      last = ll;
      coords.push(ll);
    }

    return coords;
  }

  get_duration_string(duration, hidems) {
    var s = '';

    if (duration >= _HOUR_IN_MILLIS) {
      s += Math.floor(duration / _HOUR_IN_MILLIS) + ':';
      duration = duration % _HOUR_IN_MILLIS;
    }

    var mins = Math.floor(duration / _MINUTE_IN_MILLIS);
    duration = duration % _MINUTE_IN_MILLIS;
    if (mins < 10){ s += '0';}
    s += mins + '\'';

    var secs = Math.floor(duration / _SECOND_IN_MILLIS);
    duration = duration % _SECOND_IN_MILLIS;
    if (secs < 10) s += '0';
    s += secs;

    if (!hidems && duration > 0) s += '.' + Math.round(Math.floor(duration)*1000)/1000;
    else s += '"';

    return s;
  },

  // Public methods
  to_miles:            function(v) { return v / 1.60934; },
  to_ft:               function(v) { return v * 3.28084; },
  m_to_km:             function(v) { return v / 1000; },
  m_to_mi:             function(v) { return v / 1609.34; },

  get_name:            function() { return this._info.name; },
  get_desc:            function() { return this._info.desc; },
  get_author:          function() { return this._info.author; },
  get_copyright:       function() { return this._info.copyright; },
  get_desc:            function() { return this._info.desc; },
  get_distance:        function() { return this._info.length; },
  get_distance_imp:    function() { return this.to_miles(this.m_to_km(this.get_distance())); },

  get_start_time:      function() { return this._info.duration.start; },
  get_end_time:        function() { return this._info.duration.end; },
  get_moving_time:     function() { return this._info.duration.moving; },
  get_total_time:      function() { return this._info.duration.total; },

  get_moving_pace:     function() { return this.get_moving_time() / this.m_to_km(this.get_distance()); },
  get_moving_pace_imp: function() { return this.get_moving_time() / this.get_distance_imp(); },

  get_moving_speed:    function() { return this.m_to_km(this.get_distance()) / (this.get_moving_time() / (3600 * 1000)) ; },
  get_moving_speed_imp:function() { return this.to_miles(this.m_to_km(this.get_distance())) / (this.get_moving_time() / (3600 * 1000)) ; },

  get_elevation_gain:     function() { return this._info.elevation.gain; },
  get_elevation_loss:     function() { return this._info.elevation.loss; },
  get_elevation_data:     function() {
    var _this = this;
    return this._info.elevation._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_km, null,
        function(a, b) { return a.toFixed(2) + ' km, ' + b.toFixed(0) + ' m'; });
      });
  },
  get_elevation_data_imp: function() {
    var _this = this;
    return this._info.elevation._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_mi, _this.to_ft,
        function(a, b) { return a.toFixed(2) + ' mi, ' + b.toFixed(0) + ' ft'; });
      });
  },

  get_average_hr:         function() { return this._info.hr.avg; },

  get_heartrate_data:     function() {
    var _this = this;
    return this._info.hr._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_km, null,
        function(a, b) { return a.toFixed(2) + ' km, ' + b.toFixed(0) + ' bpm'; });
      });
  },

  get_heartrate_data_imp: function() {
    var _this = this;
    return this._info.hr._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_mi, null,
        function(a, b) { return a.toFixed(2) + ' mi, ' + b.toFixed(0) + ' bpm'; });
      });
  },

  _prepare_data_point: function(p, trans1, trans2, trans_tooltip) {
    var r = [trans1 && trans1(p[0]) || p[0], trans2 && trans2(p[1]) || p[1]];
    r.push(trans_tooltip && trans_tooltip(r[0], r[1]) || (r[0] + ': ' + r[1]));
    return r;
  },

  _parse: function(input, options, async) {
    var _this = this;
    var cb = function(gpx, options) {
      var layers = _this._parse_gpx_data(gpx, options);
      if (!layers) return;
      _this.addLayer(layers);
      _this.fire('loaded');
    }
    if (input.substr(0,1)==='<') { // direct XML has to start with a <
      var parser = new DOMParser();
      setTimeout(function() {
        cb(parser.parseFromString(input, "text/xml"), options);
      });
    } else {
      this._load_xml(input, cb, options, async);
    }
  },

  _dist2d: function(a, b) {
    var R = 6371000;
    var dLat = this._deg2rad(b.lat - a.lat);
    var dLon = this._deg2rad(b.lng - a.lng);
    var r = Math.sin(dLat/2) *
      Math.sin(dLat/2) +
      Math.cos(this._deg2rad(a.lat)) *
      Math.cos(this._deg2rad(b.lat)) *
      Math.sin(dLon/2) *
      Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(r), Math.sqrt(1-r));
    var d = R * c;
    return d;
  },

  _dist3d: function(a, b) {
    var planar = this._dist2d(a, b);
    var height = Math.abs(b.meta.ele - a.meta.ele);
    return Math.sqrt(Math.pow(planar, 2) + Math.pow(height, 2));
  },

  _deg2rad: function(deg) {
    return deg * Math.PI / 180;
  }
});
