import {Injectable} from '@angular/core';
import {MapService} from './map.service';
import {VRPService} from './vrp.service';
import {VRPCustomer} from '../domain/VRPCustomer';
import {VRPDepot} from '../domain/VRPDepot';
import {PaneType, VRPProblem} from '../domain/VRPProblem';
import {deserialize} from 'class-transformer';

@Injectable()
export class ImportService {

  constructor(private vRPService: VRPService, private mapService: MapService) {

  }

  public importVRPFile(s, id) {

    const lines = s.split('\n');

    const START_SECTION = ['NAME', 'COMMENT', 'TYPE', 'DIMENSION', 'EDGE_WEIGHT_TYPE', 'CAPACITY'];
    const SECTION_NAMES = ['NODE_COORD_SECTION', 'DEMAND_SECTION', 'DEPOT_SECTION', 'EOF'];
    let settings = {};
    let nodes = [];
    let CURRENT_SECTION = 'START';
    for (let i = 0; i < lines.length; i++) {
      let x = lines[i];
      x = x.split('\t').join(" ");
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
          let splittedCord = x.trim().split(' ');
          nodes.push({
            id: splittedCord[0],
            x: splittedCord[1],
            y: splittedCord[2]
          });
          break;
        case 'DEMAND_SECTION':
          let splittedDemand = x.trim().split(' ');
          nodes[parseInt(splittedDemand[0]) - 1].demand = splittedDemand[1];
          break;
        case 'DEPOT_SECTION':
          let splittedDepot = x.trim().split(' ');
          if (parseInt(splittedDepot[0]) > 0 && nodes.includes(parseInt(splittedDepot[0]) - 1)) {
            nodes[parseInt(splittedDepot[0]) - 1].isDepot = true;
          } else {
            if (splittedDepot[0] != '-1')
              nodes.push({
                id: i,
                x: splittedDepot[0],
                y: splittedDepot[1],
                isDepot: true
              });
          }
          break;
      }
    }

    let problem = new VRPProblem(id);

    //problem.settings.capacity = parseInt(settings['CAPACITY']);
    //problem.settings.type = settings['EDGE_WEIGHT_TYPE'];

    for (let node of nodes) {
      if (node.isDepot) {
        let d = new VRPDepot(node.id, parseFloat(node.x), parseFloat(node.y));
        problem.setDepot(d);
      } else {
        let c = new VRPCustomer(node.id, parseFloat(node.x), parseFloat(node.y));
        c.demand = parseInt(node.demand);
        problem.addCustomer(c);
      }
    }

    problem.paneType = PaneType.SIMPLE;
    this.vRPService.addProblem(problem);
  }

  public importFile(s) {
    let p: VRPProblem = deserialize(VRPProblem, s);
    this.vRPService.addProblem(p);
  }
}
