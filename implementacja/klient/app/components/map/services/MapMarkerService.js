module.exports = function() {

  let paths = [];

  var DepotIcon = new L.Icon.Default({
    imagePath: 'assets/leaflet/images/',
    iconUrl: 'marker-icon-2.png',
  });

  /**
  Dodaje marker na mape
  **/
  this.addMarker = function(point, map, prefix) {
    let opts = {
      'draggable': true
    }
    if (prefix == "Depot") {
      opts.icon = DepotIcon;
    }
    let marker = L.marker(
      [point.coordinates.x, point.coordinates.y], opts).addTo(map);
    marker.bindTooltip(prefix + " #" + point.id).openTooltip();
    marker.on('dragend', function(event) {
      point.coordinates.x = event.target._latlng.lat;
      point.coordinates.y = event.target._latlng.lng;
    });
    console.log(marker);
    return marker
  }

  /**
  Rysuje linie na mapie
  **/
  this.drawPath = function(srcLat, srcLng, dstLat, dstLng, map, color) {
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
    return path;
  }

  this.clearPaths = function() {
    angular.forEach(paths, function(path) {
      path.remove();
    })
  }

}
