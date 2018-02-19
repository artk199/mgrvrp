import {Component, OnInit} from '@angular/core';
import {VRPProblem} from '../../domain/VRPProblem';
import {VRPService} from '../../services/vrp.service';
import {Coordinate} from '../../domain/Coordinate';
import {VRPDepot} from '../../domain/VRPDepot';

@Component({
  selector: 'vrp-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.css']
})
export class BaseInfoComponent implements OnInit {

  currentProblem: VRPProblem;
  depot: VRPDepot;

  algorithms = [{code: 'savings', description: 'Clarke and Wright (C & W)'},
    {code: 'jsprit', description: 'JSprit? Metaheuristic'},
    {code: 'random', description: 'Randomized Insertion (RandIns)'},
    {code: 'greedyFirst', description: 'Nearest Neighbor (NN)'},
    {code: 'tabu', description: 'Tabu search'}
  ];

  distances = [{code: 'road', description: 'Road'},
    {code: 'air', description: 'Air'}
  ];

  constructor(private vRPService: VRPService) {
    vRPService.getCurrentProblem().subscribe( p =>
      this.currentProblem = p
    );
    this.vRPService.getDepot().subscribe(depotList =>
      this.depot = depotList[0]
    );
  }

  ngOnInit() {

  }

  solve() {
    this.vRPService.solveCurrentProblem();
  }



}
