import {Coordinate} from './Coordinate';
import {VRPLocation} from './VRPLocation';

/**
 * Informacje na temat odbiorcy.
 */
export class VRPCustomer extends VRPLocation{

  id: string;
  demand: number;
  coordinates: Coordinate;

  constructor(id: string, coordinates: Coordinate = new Coordinate(0, 0)) {
    super();
    this.id = id;
    this.demand = 0;
    this.coordinates = coordinates;
  }

}
