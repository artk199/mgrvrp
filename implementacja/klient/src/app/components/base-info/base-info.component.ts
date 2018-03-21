import {Component, OnInit} from '@angular/core';
import {PaneType, VRPProblem} from '../../domain/VRPProblem';
import {VRPService} from '../../services/vrp.service';
import {VRPDepot} from '../../domain/VRPDepot';
import {VRPAlgorithm} from '../../domain/VRPAlgorithm';
import {VRPAdditionalSetting} from '../../domain/VRPAdditionalSetting';
import {forEach} from '@angular/router/src/utils/collection';

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

  settings = {
    algorithm: 'savings',
    distanceType: 'air',
    geo_distance: 'spherical'
  };

  editingDisabled = true;

  additionalSettings = [];

  distances = [
    {code: 'road', description: 'Road'},
    {code: 'air', description: 'Air'}
  ];

  constructor(private vRPService: VRPService) {
    this.vRPService.getCurrentProblem().subscribe(p => {
        this.currentProblem = p;
        this.changePaneType();
        this.onAlgorithmChange();
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
    //Zmiana settingsów na obiekty vrp additional settings
    let ads: VRPAdditionalSetting[] = [];
    for (let setting of this.additionalSettings) {
      ads.push(new VRPAdditionalSetting(setting['code'], setting['value']));
    }
    this.vRPService.solveCurrentProblem(this.settings.algorithm, this.settings.distanceType, ads);
  }

  changePaneType() {
    this.distancesAllowed = this.currentProblem.paneType != PaneType.SIMPLE;
    this.vRPService.forceRefresh();
  }

  canEditProblem(): boolean {
    return false;
  }

  onAlgorithmChange() {
    this.additionalSettings = VRPAlgorithm.algorithms.find(it => it.code == this.settings.algorithm).additionalSettings;
  }


}
