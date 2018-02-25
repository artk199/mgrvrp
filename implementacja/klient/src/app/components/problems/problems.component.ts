import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';
import {VRPProblem} from '../../domain/VRPProblem';
import {DataSource} from '@angular/cdk/collections';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import {ImportService} from '../../services/import.service';
import {serialize} from 'class-transformer';

@Component({
  selector: 'vrp-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  displayedColumns = ['id', 'size', 'actions'];
  currentProblem: VRPProblem;
  dataSource;

  constructor(private vrpService: VRPService, private importService: ImportService) {
    this.dataSource = new CustomersDataSource(this.vrpService.getProblems());
    vrpService.getCurrentProblem().subscribe(p =>
      this.currentProblem = p
    );
  }

  ngOnInit() {
  }

  public loadProblem(problem) {
    this.vrpService.loadProblemAndRefreshMap(problem.id);
  }

  importVRPFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.importService.importVRPFile(reader.result, file.name);
    };
    reader.readAsText(file);
  }

  saveToStorage() {
    this.vrpService.saveProblemsToStorage();
  }

  createNewProblem() {
    this.vrpService.createNewProblem(ProblemsComponent.generateName());
  }

  deleteProblem(problem) {
    this.vrpService.deleteProblem(problem);
  }

  exportProblem(problem) {
    let data = "data:text/json;charset=utf-8," + encodeURIComponent(serialize(problem));
    let dlAnchorElem = document.getElementById('export_link');
    dlAnchorElem.setAttribute('href', data);
    dlAnchorElem.setAttribute('download', 'problem.json');
    dlAnchorElem.click();
  }

  importProblem(event){
    console.log(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      this.importService.importFile(reader.result);
    };
    reader.readAsText(file);
  }

  static generateName() {
    return 'xxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : ( r & 0x3 | 0x8 );
      return v.toString(16);
    });
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
