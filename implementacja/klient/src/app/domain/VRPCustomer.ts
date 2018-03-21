import {VRPLocation} from './VRPLocation';

/**
 * Informacje na temat odbiorcy.
 */
export class VRPCustomer extends VRPLocation {

  demand: number;

  constructor(name: string, x: number, y: number) {
    super();
    this.name = name;
    this.demand = 50;
    this.x = x;
    this.y = y;
  }

}
