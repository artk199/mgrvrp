module.exports = function() {

  let options = {
    baseLat: 54.3745016,
    baseLng: 18.6115296,
    baseZoom: 13
  }

  /**
  Tworzy oraz konfiguruje mapę.
  **/
  this.setUpMap = function(opt = {}) {
    angular.extend(options, opt);
    let map = createMap();
    setupContextMenu(map);
    addLegend(map);
    return map;
  }

  /**
  Tworzy mapę w punkcie wpisanym w konfigurację.
  **/
  function createMap() {
    let createdMap = L.map('mapid').setView([options.baseLat, options.baseLng], options.baseZoom);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(createdMap);
    return createdMap;
  }

  /**
  Ustawia menu kontekstowe pokazywane po kliknieciu na mapę.
  **/
  function setupContextMenu(map) {
    var popup = L.popup();
    map.on('click', function(e) {
      popup
        .setLatLng(e.latlng)
        .setContent(getContextMenuContent(e))
        .openOn(map);
    });
  }

  /**
  Zwraca treść contextMenu
  **/
  function getContextMenuContent(e) {
    return '<div class="btn-group-vertical" role="group">\
      <a class="btn btn-default" onclick="addDepot('+e.latlng.lat+','+e.latlng.lng+')">\
        <span class="glyphicon glyphicon-th"></span> Add depot\
      </a>\
      <a class="btn btn-default" onclick="addCustomer('+e.latlng.lat+','+e.latlng.lng+')">\
        <span class="glyphicon glyphicon-flag"></span> Add customer\
      </a>\
    </div>';
  }

  /**
  TODO:// Dodaje legendę do mapy
  **/
  function addLegend(map) {
    var legend = L.control({
      position: 'bottomright'
    });
    legend.onAdd = function(map) {
      var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 10, 20, 50, 100, 200, 500, 1000],
        labels = [];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
          '<i style="background:blue"></i> ' +
          grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
      }

      return div;
    };
    legend.addTo(map);
  }
}
