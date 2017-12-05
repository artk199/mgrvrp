import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPProblem} from '../../domain/VRPProblem';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'vrp-problems',
  templateUrl: './problems.component.html'
})
export class ProblemsComponent implements OnInit {

  displayedColumns = [ 'id', 'size'];
  dataSource;

  constructor(private vrpService: VRPService) {
    this.dataSource = new CustomersDataSource(this.vrpService.getProblems());
  }

  ngOnInit() {
  }

}

export class CustomersDataSource extends DataSource<any> {

  constructor(private problems: Observable<VRPProblem[]>) {
    super();
  }

  connect(): Observable<VRPProblem[]> {
    return this.problems;
  }

  disconnect() {
  }
}
