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

}
