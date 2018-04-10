import {Component, OnInit, ViewChild} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import {VRPSolution} from '../../domain/VRPSolution';
import {MatSort} from '@angular/material';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Component({
  selector: 'vrp-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {

  displayedColumns = ['id', 'length', 'actions'];
  dataSource;

  @ViewChild(MatSort) sort: MatSort;

  constructor(private vRPService: VRPService) {

  }

  ngOnInit(): void {
    this.dataSource = new SolutionsDataSource(this.vRPService.getSolutions(), this.sort);
  }


  loadSolution(solution) {
    this.vRPService.loadSolution(solution);
  }

  deleteSolution(solution) {
    this.vRPService.deleteSolution(solution);
  }

}

export class SolutionsDataSource extends DataSource<any> {

  constructor(private solutions: BehaviorSubject<VRPSolution[]>, private _sort: MatSort) {
    super();
  }

  connect(): Observable<VRPSolution[]> {
    const displayDataChanges = [
      this.solutions,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {
  }

  /** Returns a sorted copy of the database data. */
  getSortedData(): VRPSolution[] {
    let data = this.solutions.value;
    if (!this._sort.active || this._sort.direction == '') {
      return data;
    }
    console.log(data);
    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'length':
          [propertyA, propertyB] = [a.routeLength, b.routeLength];
          break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}
