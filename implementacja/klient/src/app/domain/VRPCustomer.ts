import {Coordinate} from './Coordinate';

/**
 * Informacje na temat odbiorcy.
 */
export class VRPCustomer {

  id: string;
  demand: number;
  coordinates: Coordinate;

  constructor(id: string, coordinates: Coordinate = new Coordinate(0, 0)) {
    this.id = id;
    this.demand = 0;
    this.coordinates = coordinates;
  }

}
