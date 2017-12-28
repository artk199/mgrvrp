import {Coordinate} from './Coordinate';
import {VRPLocation} from './VRPLocation';

export class VRPDepot extends VRPLocation{
  id: string;
  coordinates: Coordinate;

  constructor(id: string, coordinates: Coordinate) {
    super();
    this.id = id;
    this.coordinates = coordinates;
  }
}
