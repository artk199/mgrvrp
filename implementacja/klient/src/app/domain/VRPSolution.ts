import {VRPRoute} from './VRPRoute';
import {Exclude, Type} from 'class-transformer';
import {VRPSolutionStep} from './VRPSolutionStep';
import {VRPAdditionalSetting} from './VRPAdditionalSetting';

export class VRPSolution {

  @Type(() => VRPRoute)
  routes: VRPRoute[];
  algorithm: string;
  distanceType: string;
  routeLength: any;
  additionalSettings: VRPAdditionalSetting[];

  @Exclude()
  public solutionsSteps: VRPSolutionStep[] = [];

}
