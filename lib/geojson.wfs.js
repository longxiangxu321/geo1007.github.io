// the function tryParseJSON was adapted from this Stack Overflow question:
// http://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
function tryParseJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);

        // Handle non-exception-throwing cases:
        // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
        // but... JSON.parse(null) returns 'null', and typeof null === "object", 
        // so we must check for that, too.
        if (o && typeof o === "object" && o !== null) {
            return o;
        }
    } catch (e) {}

    return false;
};


function popUp(f,l){
    var out = [];
    if (f.properties){
        for(key in f.properties){
            out.push(key+": "+f.properties[key]);
        }
        l.bindPopup(out.join("<br />"));
    }
}


function GeojsonFromWFS(url, params, styleParams) {
    var geojson = L.geoJson(null, {
        style: styleParams,
        onEachFeature: popUp
    });


    GetFeatureWFS( url, params, function(validJson ) {
                //console.log(validJson);
                geojson.addData(validJson);
                console.log("Added " + geojson.getLayers().length + " points");
                } ) ;
 
 
    return geojson;

}


function GetFeatureWFS(url, params, callback_handleJson) {

    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        if (xhr.status === 200) {
                      
            var validJson = tryParseJSON(xhr.responseText);
            if (validJson) {
                callback_handleJson(validJson) ;
            } else {
                console.log('Response is not valid json. Response is: ');
                console.log(xhr.responseText);
                handleError(url + params + ' gives output: ' + xhr.responseText) ;
            }
            
        } else {
            console.log('Request failed.  Returned status of ' + xhr.status + ' ' + xhr.statusText );
            handleError(url + params + ' gives error: ' + xhr.status + ' ' + xhr.statusText) ;
        }
    };
    xhr.onerror = function() {
            console.log('Request failed.  Returned status of ' + xhr.status + ' ' + xhr.statusText );
            handleError(url + params + ' gives error: ' + xhr.status + ' ' + xhr.statusText) ;
    };
    xhr.open('GET', encodeURI(url + params));
    xhr.send();


}


function handleError(text) {    
    //var xmlText = new XMLSerializer().serializeToString(xhr.responseXML);
    
    var xmlTextNode = document.createTextNode('=== '+text);
    var parentDiv = document.getElementById('errors');
    parentDiv.appendChild(xmlTextNode);
    parentDiv.appendChild(document.createElement("br"));
}

