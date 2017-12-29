import {VRPLocation} from './VRPLocation';
import {Type} from 'class-transformer';

export class VRPRoute {

  @Type(() => VRPLocation)
  public driveRoute: VRPLocation[];

}
