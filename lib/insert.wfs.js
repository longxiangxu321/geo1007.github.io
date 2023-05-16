
		// INSERT point feature
		function insertPoint(url_wfs, typeName, namespace_prefix, namespace_uri, featProperties, geomPropertyName, lng, lat) {
								
            // Create POST request
			var postData = 
				'<wfs:Transaction'
			  + '  service="WFS"'
			  + '  version="1.0.0"'
			  + '  xmlns:'+ namespace_prefix +'="'+ namespace_uri +'"'
			  + '  xmlns:wfs="http://www.opengis.net/wfs"'
			  + '  xmlns:gml="http://www.opengis.net/gml"'
			  + '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'
			  + '  xsi:schemaLocation="http://www.opengis.net/wfs  http://schemas.opengis.net/wfs/1.1.0/WFS-transaction.xsd '
	          + '  '+ namespace_uri +' http://pakhuis.tudelft.nl:8088/geoserver/wfs/DescribeFeatureType?typename='+ typeName +'">'
			  + '  <wfs:Insert>'
			  + '    <'+ typeName +'>'
			  + '      <'+ featProperties[0].name +'>'+ featProperties[0].value +'</'+ featProperties[0].name +'>'
			  + '      <'+ featProperties[1].name +'>'+ featProperties[1].value +'</'+ featProperties[1].name +'>'	
			  + '      <'+ geomPropertyName +'>'
			  + '        <gml:Point srsDimension="2" srsName="EPSG:4326">'
			  + '          <gml:coordinates decimal="." cs="," ts=" ">'+ lng +','+ lat +'</gml:coordinates>'
			  + '        </gml:Point>'
			  + '      </'+ geomPropertyName +'>'
			  + '    </'+ typeName +'>'
			  + '  </wfs:Insert>'
			  + '</wfs:Transaction>';
			
			$.ajax({
				type: "POST",
				url: url_wfs,
				data: postData,
				contentType: "text/xml",
				dataType: "xml",
				success: function(xml) {
				
					if (xml.documentElement.nodeName === 'wfs:WFS_TransactionResponse') {
						var fid = xml.documentElement.getElementsByTagName("ogc:FeatureId")[0].getAttribute("fid");
						console.log( 'Point feature '+ fid +' inserted successfully, lat:' + lat + ", lng:" + lng ) ;
						// alert( fid +' is stored') ;
						L.marker([lat, lng]).addTo(map);
						$(".leaflet-popup-close-button")[0].click() ;
						
					}			
					else if (xml.documentElement.nodeName === 'ServiceExceptionReport' ) {
						console.log('error in WFS insert of feature') ;
						var xmlText = new XMLSerializer().serializeToString(xml);
						console.log( xmlText );
					}
					else {
						console.log('unknown error in WFS insert of feature') ;
						console.log( xml );	
					}
				},
				error: function() {
				    console.log('An error occured in WFS insert of feature') ;
				}
			});
		}