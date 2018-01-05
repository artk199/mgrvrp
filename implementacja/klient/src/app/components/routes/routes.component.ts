import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPSolution} from '../../domain/VRPSolution';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import {VRPRoute} from '../../domain/VRPRoute';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'vrp-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent implements OnInit {

  currentSolution: VRPSolution;

  displayedColumns = ['actions', 'id', 'length', 'bar'];
  dataSource;

  constructor(private vRPService: VRPService) {
    this.dataSource = new ProblemDataSource(this.vRPService.getSolutions());
  }


  ngOnInit(): void {
  }

  calculatePosition(route, point) {
    console.log(route);
    let sum = 0;
    for (let r of route.drivePoints) {
      sum += r.routeLength;
      if (r.destination.id == point.id) {
        break;
      }
    }
    return '' + sum/route.routeLength *100 + '%';
  }

}

export class ProblemDataSource extends DataSource<any> {

  constructor(private solutions: Observable<VRPSolution[]>) {
    super();
  }

  connect(): Observable<VRPRoute[]> {
    return this.solutions.map(x => {
      if (x[0]) return x[0].routes;
    });
  }

  disconnect() {
  }
}
