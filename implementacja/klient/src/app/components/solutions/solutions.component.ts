import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {VRPSolution} from '../../domain/VRPSolution';

@Component({
  selector: 'vrp-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {

  displayedColumns = ['id', 'length', 'actions'];
  dataSource;

  constructor(private vRPService: VRPService) {
    this.dataSource = new SolutionsDataSource(this.vRPService.getSolutions());
  }

  ngOnInit(): void {
  }


  loadSolution(solution) {
    this.vRPService.loadSolution(solution);
  }

  deleteSolution(solution) {
    this.vRPService.deleteSolution(solution);
  }

  solve() {
    this.vRPService.solveCurrentProblem();
  }

}

export class SolutionsDataSource extends DataSource<any> {

  constructor(private solutions: Observable<VRPSolution[]>) {
    super();
  }

  connect(): Observable<VRPSolution[]> {
    return this.solutions;
  }

  disconnect() {
  }
}
