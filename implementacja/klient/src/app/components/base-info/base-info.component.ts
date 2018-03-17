import {Component, OnInit} from '@angular/core';
import {PaneType, VRPProblem} from '../../domain/VRPProblem';
import {VRPService} from '../../services/vrp.service';
import {Coordinate} from '../../domain/Coordinate';
import {VRPDepot} from '../../domain/VRPDepot';
import {VRPAlgorithm} from '../../domain/VRPAlgorithm';
import {MapService} from '../../services/map.service';

@Component({
  selector: 'vrp-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.css']
})
export class BaseInfoComponent implements OnInit {

  currentProblem: VRPProblem;
  depot: VRPDepot;
  distancesAllowed: boolean = true;

  algorithms: VRPAlgorithm[] = VRPAlgorithm.algorithms;

  distances = [
    {code: 'road', description: 'Road'},
    {code: 'air', description: 'Air'}
  ];

  constructor(private vRPService: VRPService, private mapService: MapService) {
    this.vRPService.getCurrentProblem().subscribe(p => {
        this.currentProblem = p;
        this.changePaneType();
      }
    );
    this.vRPService.getDepot().subscribe(depotList => this.depot = depotList[0]);
  }

  ngOnInit() {
    if (!this.currentProblem.algorithm) {
      this.currentProblem.algorithm = this.algorithms[0];
    }
    this.changePaneType();
  }

  solve() {
    this.vRPService.solveCurrentProblem();
  }

  changePaneType() {
    if (this.currentProblem.paneType == PaneType.SIMPLE) {
      this.distancesAllowed = false;
      this.currentProblem.settings.distance = 'simple';
    } else {
      this.distancesAllowed = true;
      this.currentProblem.settings.distance = 'road';
    }
    this.vRPService.forceRefresh();
  }


}
