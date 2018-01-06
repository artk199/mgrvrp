import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPSolution} from '../../domain/VRPSolution';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {VRPRoute} from '../../domain/VRPRoute';
import {forEach} from '@angular/router/src/utils/collection';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'vrp-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  displayedColumns = ['actions', 'length', 'bar'];
  dataSource;

  constructor(private vRPService: VRPService, private mapService: MapService) {
    this.dataSource = new ProblemDataSource(this.vRPService.currentSolution);
  }

  ngOnInit(): void {
  }

  calculatePosition(route, point) {
    let sum = 0;
    for (let r of route.drivePoints) {
      sum += r.routeLength;
      if (r.destination.id == point.id) {
        break;
      }
    }
    return '' + sum/route.routeLength *100 + '%';
  }

  toggle(route: VRPRoute){
      this.mapService.togglePaths(route.mapPaths);
  }

  setActive(route: VRPRoute){
    MapService.markAsCurrent(route.mapPaths);
  }

  setNormal(route: VRPRoute){
    MapService.markAsNormal(route.mapPaths);
  }

}

export class ProblemDataSource extends DataSource<any> {

  constructor(private solutions: Observable<VRPSolution>) {
    super();
  }

  connect(): Observable<VRPRoute[]> {
    return this.solutions.map(x => {
      if (x) return x.routes;
    });
  }

  disconnect() {
  }
}
