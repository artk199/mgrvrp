import {Coordinate} from './Coordinate';
import {VRPLocation} from './VRPLocation';
import {Type} from 'class-transformer';

/**
 * Informacje na temat odbiorcy.
 */
export class VRPCustomer extends VRPLocation{

  demand: number;

  constructor(id: string, coordinates: Coordinate = new Coordinate(0, 0)) {
    super();
    this.id = id;
    this.demand = 50;
    this.coordinates = coordinates;
  }

}
