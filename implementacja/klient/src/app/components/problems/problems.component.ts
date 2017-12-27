import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPProblem} from '../../domain/VRPProblem';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {ImportService} from '../../services/import.service';

@Component({
  selector: 'vrp-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  displayedColumns = [ 'id', 'size', 'actions'];
  currentProblem: VRPProblem;
  dataSource;

  constructor(private vrpService: VRPService, private importService: ImportService) {
    this.dataSource = new CustomersDataSource(this.vrpService.getProblems());
    this.currentProblem = this.vrpService.getCurrentProblem();
  }

  ngOnInit() {
  }

  public loadProblem(problem){
    this.vrpService.loadProblem(problem.id);
    this.currentProblem = this.vrpService.getCurrentProblem();
  }

  uploadFile(event) {
    console.log(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.importService.importVRPFile(reader.result, file.name);
    };
    reader.readAsText(file);
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
