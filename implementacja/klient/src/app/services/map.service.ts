import {Injectable} from '@angular/core';
import * as L from 'leaflet';
import {Coordinate} from '../domain/Coordinate';
import {VRPCustomer} from '../domain/VRPCustomer';
import {VRPDepot} from '../domain/VRPDepot';
import {VRPSolution} from '../domain/VRPSolution';
import {VRPRoute} from '../domain/VRPRoute';

@Injectable()
export class MapService {

  public MAP_ID = 'mapid';
  private options = {
    baseLat: 54.3745016,
    baseLng: 18.6115296,
    baseZoom: 13
  };

  private _map: any = null;
  private _clickEvent: any;
  private markers = [];
  private paths = [];

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

    this._map.on('click', this._clickEvent);
  }

  public changeToSimplePlane() {
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
   * Usuwa i tworzy od nowa mapę - hard reset
   */
  public clearMap() {
    let s = this;
    for (let i = 0; i < this.markers.length; i++) {
      this._map.removeLayer(this.markers[i]);
    }
    this.markers = [];
    this.clearPaths();
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
      icon: icon,
      title: ''
    };
    const marker = L.marker(
      [coordinates.x, coordinates.y], opts).addTo(this._map);
    marker.bindTooltip(name).openTooltip();
    marker.on('dragend', function (event) {
      coordinates.x = event.target._latlng.lat;
      coordinates.y = event.target._latlng.lng;
    });
    this.markers.push(marker);
    return marker;
  }

  setupClickEvent(fnc) {
    this._clickEvent = fnc;
  }

  drawSolution(solution: VRPSolution) {
    this.clearPaths();
    for (let route of solution.routes) {
      let paths = [];
      for (let drivePoint of route.drivePoints) {
        let from = drivePoint.from;
        for (let to of drivePoint.points) {
          let path = MapService.generatePolylinePath(
            from.coordinates.x,
            from.coordinates.y,
            to.coordinates.x,
            to.coordinates.y,
            route.color
          );
          paths.push(path);
          path.on('mouseover', function (e) {
            MapService.markAsCurrent(route);
          });
          path.on('mouseout', function (e) {
            MapService.markAsNormal(route);
          });
          from = to;
        }
      }
      route.mapPaths = L.layerGroup(paths);
      this.showPaths(route.mapPaths);
    }
  }

  static generatePolylinePath(srcLat, srcLng, dstLat, dstLng, color) {
    let pointA = new L.LatLng(srcLat, srcLng);
    let pointB = new L.LatLng(dstLat, dstLng);
    let pointList = [pointA, pointB];
    return new L.Polyline(pointList, {
      color: color,
      weight: 3,
      opacity: 1,
      smoothFactor: 1
    });
  }

  public showPaths(mapPaths: any) {
    this._map.addLayer(mapPaths);
    this.paths.push(mapPaths);
  }

  public togglePaths(mapPaths: any) {
    if (this._map.hasLayer(mapPaths)) {
      this._map.removeLayer(mapPaths);
    } else {
      this._map.addLayer(mapPaths);
    }
  }

  public static markAsCurrent(route: VRPRoute) {
    route.mapPaths.eachLayer(function(path) {
      path.setStyle({
        weight: 5
      });
    });
  }

  public static markAsNormal(route: VRPRoute){
    route.mapPaths.eachLayer(function(path) {
      path.setStyle({
        weight: 3
      });
    });
  }

  private clearPaths() {
    for (let i = 0; i < this.paths.length; i++) {
      this._map.removeLayer(this.paths[i]);
    }
    this.paths = [];
  }

}
