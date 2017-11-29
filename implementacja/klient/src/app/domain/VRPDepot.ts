import {Coordinate} from './Coordinate';

export class VRPDepot {
  id: string;
  coordinates: Coordinate;

  constructor(id: string, coordinates: Coordinate) {
    this.id = id;
    this.coordinates = coordinates;
  }
}
