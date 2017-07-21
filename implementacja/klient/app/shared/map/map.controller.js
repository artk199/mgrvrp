module.exports = function(VRPService){

  let ctrl = this;
  ctrl.map;

  function setUpMap(){
    ctrl.map = L.map('mapid').setView([54.3745016, 18.6115296], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(ctrl.map);

    var popup = L.popup();

    ctrl.map.on('click', function onMapClick(e) {
        popup
            .setLatLng(e.latlng)
            .setContent("<strong>You clicked the map at " + e.latlng.toString()+"</strong>")
            .openOn(ctrl.map);
        VRPService.addDepot(e.latlng); 
    });

  }

  setUpMap();

}
