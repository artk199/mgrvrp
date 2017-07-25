module.exports = function() {

  let paths = [];
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

    var path = new L.Polyline(pointList, {
      color: color,
      weight: 3,
      opacity: 0.7,
      smoothFactor: 1
    });
    paths.push(path);
    path.addTo(map);
  }

  this.clearPaths = function(){
    angular.forEach(paths,function(path){
      path.remove();
    })
  }

}
