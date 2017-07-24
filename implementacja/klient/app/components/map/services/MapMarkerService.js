module.exports = function() {

  /**
  Dodaje marker na mape
  **/
  this.addMarker = function(lat,lng,map,id=0) {
    let marker = L.marker([lat, lng],{'draggable':true}).addTo(map);
    marker.bindTooltip("Depot #"+id).openTooltip();
    marker.on('dragend', function(event){
      alert(";))");
    });
    return marker
  }

  /**
  Rysuje linie na mapie
  **/
  this.drawPath = function(srcLat,srcLng,dstLat,dstLng,map,color) {
    var pointA = new L.LatLng(srcLat, srcLng);
    var pointB = new L.LatLng(dstLat, dstLng);
    var pointList = [pointA, pointB];

    var firstpolyline = new L.Polyline(pointList, {
      color: color,
      weight: 4,
      opacity: 1,
      smoothFactor: 1
    });
    firstpolyline.addTo(map);
    console.log("Rysuje linie.");
  }

}
