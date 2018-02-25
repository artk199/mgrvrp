import {Component, OnInit} from '@angular/core';
import {VRPProblem} from '../../domain/VRPProblem';
import {VRPService} from '../../services/vrp.service';
import {Coordinate} from '../../domain/Coordinate';
import {VRPDepot} from '../../domain/VRPDepot';
import {VRPAlgorithm} from '../../domain/VRPAlgorithm';

@Component({
  selector: 'vrp-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.css']
})
export class BaseInfoComponent implements OnInit {

  currentProblem: VRPProblem;
  depot: VRPDepot;


  algorithms: VRPAlgorithm[] = [
    new VRPAlgorithm('savings', 'Clarke and Wright (C & W)', []),
    new VRPAlgorithm('jsprit', 'JSprit? Metaheuristic', []),
    new VRPAlgorithm('random', 'Randomized Insertion (RandIns)', []),
    new VRPAlgorithm('greedyFirst', 'Nearest Neighbor (NN)', []),
    new VRPAlgorithm('tabu', 'Tabu search', [
      {
        code: 'iterations',
        description: 'Iterations',
        type: 'NUMBER',
        value: 100
      }
    ])
  ];


  distances = [{code: 'road', description: 'Road'},
    {code: 'air', description: 'Air'}
  ];

  constructor(private vRPService: VRPService) {
    this.vRPService.getCurrentProblem().subscribe(p => this.currentProblem = p);
    this.vRPService.getDepot().subscribe(depotList => this.depot = depotList[0]);
  }

  ngOnInit() {
    if (!this.currentProblem.algorithm) {
      this.currentProblem.algorithm = this.algorithms[0];
    }
  }

  solve() {
    this.vRPService.solveCurrentProblem();
  }


}
