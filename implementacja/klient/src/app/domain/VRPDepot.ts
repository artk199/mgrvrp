import {VRPLocation} from './VRPLocation';

export class VRPDepot extends VRPLocation {

  constructor(name: string, x: number = 0, y: number = 0) {
    super();
    this.name = name;
    this.x = x;
    this.y = y;
  }

}
