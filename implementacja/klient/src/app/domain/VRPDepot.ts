import {Coordinate} from './Coordinate';
import {VRPLocation} from './VRPLocation';
import {Type} from 'class-transformer';

export class VRPDepot extends VRPLocation{

  id: string;

  @Type(() => Coordinate)
  coordinates: Coordinate;

  constructor(id: string, coordinates: Coordinate) {
    super();
    this.id = id;
    this.coordinates = coordinates;
  }
}
