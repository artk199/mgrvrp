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

  algorithms = [{code: 'savings', description: 'Savings algorithm'},
    {code: 'jsprit', description: 'JSprit? Metaheuristic'},
    {code: 'random', description: 'Random solution'},
    {code: 'greedyFirst', description: 'Greedy first'}
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
