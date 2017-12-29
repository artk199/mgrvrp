import {Type} from 'class-transformer';
import {Coordinate} from './Coordinate';

export class VRPLocation {

  id: string;

  @Type(() => Coordinate)
  coordinates: Coordinate

}
