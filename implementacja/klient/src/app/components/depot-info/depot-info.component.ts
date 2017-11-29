import {Component, OnInit} from '@angular/core';
import {VRPDepot} from '../../domain/VRPDepot';
import {Coordinate} from '../../domain/Coordinate';
import {VRPService} from '../../services/vrp.service';

@Component({
  selector: 'vrp-depot-info',
  templateUrl: './depot-info.component.html',
  styleUrls: ['./depot-info.component.css']
})
export class DepotInfoComponent implements OnInit {

  depot: VRPDepot = new VRPDepot('lala', new Coordinate(123, 123));

  constructor(private vRPService: VRPService) {
  }

  ngOnInit() {
    this.vRPService.getDepot().subscribe(depotList =>
      this.depot = depotList[0]
    );
  }
}
