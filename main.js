// Definitie Rijksdriehoekstelsel (EPSG:28992)
var res = [3440.640, 1720.320, 860.160, 430.080, 215.040, 107.520, 53.760, 26.880, 13.440, 6.720, 3.360, 1.680, 0.840, 0.420, 0.210, 0.105];

var map = L.map('map-canvas', { // eslint-disable-line no-undef
  continuousWorld: true,
  crs: new L.Proj.CRS('EPSG:28992', '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +towgs84=565.2369,50.0087,465.658,-0.406857330322398,0.350732676542563,-1.8703473836068,4.0812 +no_defs', { // eslint-disable-line no-undef
    transformation: L.Transformation(-1, -1, 0, 0), // eslint-disable-line no-undef
    resolutions: res,
    origin: [-285401.920, 903401.920],
    bounds: L.bounds([-285401.920, 903401.920], [595401.920, 22598.080]) // eslint-disable-line no-undef
  }),
  layers: [],
  center: [52.00553, 4.370668],
  zoom: 10,

});
map.attributionControl.setPrefix('');
map.locate({setView: true, maxZoom: 16});

function onLocationFound(e) {
  var radius = e.accuracy;

  L.marker(e.latlng).addTo(map)
      .bindPopup("You are within " + radius + " meters from this point").openPopup();

  L.circle(e.latlng, radius).addTo(map);
}

map.on('locationfound', onLocationFound);


function onLocationError(e) {
  alert(e.message);
}

map.on('locationerror', onLocationError);






// 1. BRT-Achtergrondkaart van PDOK:
var options = { maxZoom: 14, attribution: 'Map data: <a href="http://www.pdok.nl">BRT Achtergrondkaart</a>' }
var basemap_pdok = new L.tileLayer('https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/standaard/EPSG:28992/{z}/{x}/{y}.png', options);

basemap_pdok.getAttribution = function () {
  return 'BRT Achtergrondkaart <a href="http://www.kadaster.nl">Kadaster</a>.';
}
basemap_pdok.addTo(map);

// 2.a. this is to group the base layers (background)
var baseLayers = {
  "Topographical map": basemap_pdok
};

// 2.b. this is to group all other layers
var overlays = {
  "Events": events_wfs
};

events_wfs.addTo(map) ;

// 2.c. this is the control for switching layers on and off - the variables baseLayers and overlays group the layers
L.control.layers(baseLayers, overlays).addTo(map);

// add geocoder to map
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
})
  .on('markgeocode', function (e) {

    if (window.polygon !== undefined){
      window.map.removeLayer(window.polygon);
    }


    var bbox = e.geocode.bbox;
    var poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest()
    ]);
    window.polygon = poly;
    window.map.addLayer(window.polygon);
    map.fitBounds(poly.getBounds());
  })
  .addTo(map);

// add functionality to add to WFS
var popup = L.popup();

var url_wfs = 'https://varioscale.bk.tudelft.nl/geoserver/geoweb/ows?';
var featuretype = "geoweb:events_all" ;		
var namespace_prefix = "geoweb" ;
var namespace_uri = "http://all.kinds.of.data" ;
var geomPropertyName = "geoweb:geom" ;

function insertWFS(lng, lat, event_name, reported_by) {
  var featProperties = [
    { "name": "geoweb:event_name", "value": event_name },
    { "name": "geoweb:reported_by", "value": reported_by }
  ];

  insertPoint(url_wfs, featuretype, namespace_prefix, namespace_uri, featProperties, geomPropertyName, lng, lat);
}

function onMapClick(e) {
  var lng = e.latlng.lng;
  var lat = e.latlng.lat;

  var js_function = ''
    + ' var event_name = document.getElementById(\'event_name\').value ; '
    + ' var reported_by = document.getElementById(\'reported_by\').value ; '
    + ' insertWFS(' + lng + ',' + lat + ', event_name, reported_by) ; ';

  var event_name = "";
  var reported_by = "";
  var popupContent = ''
    + '<label for="event_name">Event name: </label><br>'
    + '<input  type="text" id="event_name" name="event_name" value="' + event_name + '"/><br>'
    + '<label for="reported_by" >Reported by: </label><br>'
    + '<input  type="text" id="reported_by" name="reported_by" value="' + reported_by + '"/><br>'
    //+'<button type="button" onclick="insertWFS('+lng+','+lat+', document.getElementById(\'event_name\').value, document.getElementById(\'reported_by\').value )">Insert point</button>' ;
    + '<button type="button" onclick="' + js_function + '">Insert point</button>';

  popup
    .setLatLng(e.latlng)
    .setContent(popupContent)
    .openOn(map);
}

map.on('click', onMapClick);