import {VRPLocation} from './VRPLocation';
import {Type} from 'class-transformer';
import {VRPDrivePoints} from './VRPDrivePoints';

export class VRPRoute {

  @Type(() => VRPDrivePoints)
  public drivePoints: VRPDrivePoints[];

  @Type(() => VRPLocation)
  public points: VRPLocation[];

  public routeLength: any;
  public color: any;

}
