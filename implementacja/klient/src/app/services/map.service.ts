import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Coordinate} from '../domain/Coordinate';
import {VRPCustomer} from '../domain/VRPCustomer';
import {VRPDepot} from '../domain/VRPDepot';

@Injectable()
export class MapService {

  public MAP_ID = 'mapid';

  private options = {
    baseLat: 54.3745016,
    baseLng: 18.6115296,
    baseZoom: 13
  };

  private _map: any = null;

  get map(): any {
    return this._map;
  }

  /**
   * Inicjalizaja mapy:
   * - przypisuje mapę do danego elementu HTMLowego,
   * - ustawia punkt startowy na mapie oraz zoom,
   * - ustawia skąd pobierać tilesy dla mapy
   * - przestawia kontrolki na prawy górny róg (defaultowo jest w lewym górym rogu)
   * - dodaje menu dodawania nowego customera/depotu po kliknieciu na mapę
   */
  public setupMap() {

    this._map = L.map(this.MAP_ID, {
      zoomControl: false
    }).setView([this.options.baseLat, this.options.baseLng], this.options.baseZoom);

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this._map);

    L.control.zoom({
      position: 'topright'
    }).addTo(this._map);
  }

  public changeToSimplePlane(){
    this._map.remove();
    this._map = L.map(this.MAP_ID, {
      crs: L.CRS.Simple,
      zoomControl: false
    }).setView([50, 50], 5);

    L.control.zoom({
      position: 'topright'
    }).addTo(this._map);
  }

  /**
   * Dodaje marker na mape
   */
  public addCustomerToMap(customer: VRPCustomer) {
    const customerIcon = new L.Icon.Default({
      imagePath: 'assets/leaflet/images/',
      iconUrl: 'marker-icon.png',
    });
    this.addMarker(customer.coordinates, customerIcon, customer.id);
  }

  /**
   * Dodaje marker z magazynem na mapę oraz usuwa poprzedni marker jezeli taki istnieje.
   */
  public addDepotToMap(depot: VRPDepot) {
    const depotIcon = new L.Icon.Default({
      imagePath: 'assets/leaflet/images/',
      iconUrl: 'marker-icon-2.png',
    });
    this.addMarker(depot.coordinates, depotIcon, depot.id);
  }

  private addMarker(coordinates: Coordinate, icon, name) {
    const opts = {
      draggable: true,
      icon: icon
    };
    const marker = L.marker(
      [coordinates.x, coordinates.y], opts).addTo(this._map);
    marker.bindTooltip(name).openTooltip();
    marker.on('dragend', function (event) {
      coordinates.x = event.target._latlng.lat;
      coordinates.y = event.target._latlng.lng;
    });
    return marker;
  }

}
