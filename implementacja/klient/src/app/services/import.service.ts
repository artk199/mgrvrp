import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {VRPService} from './vrp.service';
import {VRPCustomer} from '../domain/VRPCustomer';
import {Coordinate} from '../domain/Coordinate';
import {VRPDepot} from '../domain/VRPDepot';

@Injectable()
export class ImportService {

  constructor(private vRPService: VRPService, private mapService: MapService) {

  }

  public importVRPFile(s) {

    this.mapService.changeToSimplePlane();
    const lines = s.split('\n');

    const START_SECTION = ['NAME', 'COMMENT', 'TYPE', 'DIMENSION', 'EDGE_WEIGHT_TYPE', 'CAPACITY'];
    const SECTION_NAMES = ['NODE_COORD_SECTION', 'DEMAND_SECTION', 'DEPOT_SECTION', 'EOF'];
    let settings = {};
    let nodes = [];
    let CURRENT_SECTION = 'START';
    for (let i = 0; i < lines.length; i++) {
      const x = lines[i];
      const startFound = START_SECTION.some((e) => {
        const ret = x.startsWith(e);
        if (ret === true) {
          settings[e] = x.split(e + ' : ')[1];
        }
        return ret;
      });
      if (startFound) {
        continue;
      }
      const sectionFound = SECTION_NAMES.some((e) => {
        const ret = x.startsWith(e);
        if (ret === true) {
          console.log('Zmiana sekcji na: ' + e);
          CURRENT_SECTION = e;
        }
        return ret;
      });
      if (sectionFound) {
        continue;
      }
      switch (CURRENT_SECTION) {
        case 'NODE_COORD_SECTION':
          let splittedCord = x.split(' ');
          nodes.push({
            id:splittedCord[1],
            x:splittedCord[2],
            y:splittedCord[3]
          });
          break;
        case 'DEMAND_SECTION':
          let splittedDemand = x.split(' ');
          nodes[parseInt(splittedDemand[0])-1].demand = splittedDemand[1];
          break;
        case 'DEPOT_SECTION':
          let splittedDepot = x.split(' ');
          if(splittedDepot[1] != '-1'){
            nodes[parseInt(splittedDepot[1])-1].isDepot = true;
          }
          break;
      }
    }
    for(let node of nodes){
      if(node.isDepot){
        let d = new VRPDepot(node.id, new Coordinate(node.x,node.y));
        this.vRPService.addDepot(d);
      }else{
        let c = new VRPCustomer(node.id,new Coordinate(node.x,node.y));
        this.vRPService.addCustomer(c);
      }
    }
  }
}
