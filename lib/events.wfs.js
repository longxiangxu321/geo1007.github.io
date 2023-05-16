//var url = 'http://pakhuis.tudelft.nl:8088/geoserver/wfs?';
var url = 'https://varioscale.bk.tudelft.nl/geoserver/wfs?';

// These are the basic parameters for a WFS request (let op: epsg is 4326 voor Leaflet WFS):
var params = 'service=WFS&version=2.0.0&request=GetFeature&outputFormat=application/json&srsName=EPSG:4326&';

// + Specify the WFS feature type that you request from the WFS service
// In this case the points users added to the map:
params += 'typeName=geoweb:events_all&';

// If problems with loading time: limit amount of features (for debug)
//params += 'maxFeatures=400&';
params += 'count=20000&';


var styleParams = {
            color: 'black',
            fillColor: 'green',
            weight: 1.0,
            opacity: 0.6,
            fillOpacity: 0.4
        } ;


var events_wfs = GeojsonFromWFS( url, params, styleParams ) ;
