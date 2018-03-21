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
  isLoadedStep;
  currentStep = 0;
  maxSteps = 0;
  currentSolution: VRPSolution;

  constructor(private vRPService: VRPService, private mapService: MapService) {
    let ctrl = this;
    this.dataSource = new ProblemDataSource(this.vRPService.currentSolution);
    vRPService.currentSolution.subscribe(sol => {
        ctrl.currentSolution = sol;
        if (sol && sol.solutionsSteps) {
          ctrl.maxSteps = sol.solutionsSteps.length;
          ctrl.currentStep = ctrl.maxSteps;
        }else{
          ctrl.maxSteps = 0;
          ctrl.currentStep = 0;
        }
      }
    );
  }

  ngOnInit(): void {
  }

  calculatePosition(route, point) {
    let sum = 0;
    for (let r of route.drivePoints) {
      sum += r.routeLength;
    }
    return '' + sum / route.routeLength * 100 + '%';
  }

  toggle(route: VRPRoute) {
    this.mapService.togglePaths(route.mapPaths);
  }

  setActive(route: VRPRoute) {
    MapService.markAsCurrent(route);
  }

  setNormal(route: VRPRoute) {
    MapService.markAsNormal(route);
  }

  onTabChanged(event) {
    switch (event.index) {
      case 0:
        this.loadSolution();
      case 1:
        this.loadCurrentStep();
    }
    console.log(event.index);
  }

  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.loadCurrentStep();
    }
  }

  nextStep() {
    if (this.currentStep < this.maxSteps) {
      this.currentStep++;
      this.loadCurrentStep();
    }
  }

  private loadCurrentStep() {
    if (this.currentSolution) {
      if (this.currentStep == this.maxSteps)
        this.loadSolution();
      else
        this.mapService.drawSolution(this.currentSolution.solutionsSteps[this.currentStep].data);
    }
  }

  private loadSolution() {
    console.log(this.currentSolution);
    if (this.currentSolution)
      this.mapService.drawSolution(this.currentSolution);
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
