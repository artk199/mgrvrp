import {Component, OnInit} from '@angular/core';
import {VRPProblem} from '../../domain/VRPProblem';
import {VRPService} from '../../services/vrp.service';

@Component({
  selector: 'vrp-base-info',
  templateUrl: './base-info.component.html',
  styleUrls: ['./base-info.component.css']
})
export class BaseInfoComponent implements OnInit {

  currentProblem: VRPProblem;

  algorithms = [{code: 'savings', description: 'Savings algorithm'},
    {code: 'jsprit', description: 'JSprit? Metaheuristic'},
    {code: 'random', description: 'Random solution'}
  ];

  distances = [{code: 'road', description: 'Road'},
    {code: 'air', description: 'Air'}
  ];

  constructor(vRPService: VRPService) {
    vRPService.getCurrentProblem().subscribe( p =>
      this.currentProblem = p
    );
  }

  ngOnInit() {

  }


}
