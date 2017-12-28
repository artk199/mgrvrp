import {Component, OnInit} from '@angular/core';
import {VRPService} from '../../services/vrp.service';

@Component({
  selector: 'vrp-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {

  constructor(private vRPService: VRPService){

  }

  ngOnInit(): void {
  }

  solve(){
    this.vRPService.solveCurrentProblem();
  }

}
