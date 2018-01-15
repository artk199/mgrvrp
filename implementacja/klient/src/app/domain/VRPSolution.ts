import {VRPRoute} from './VRPRoute';
import {Exclude} from 'class-transformer';
import {VRPSolutionStep} from './VRPSolutionStep';

export class VRPSolution {

  routes: VRPRoute[];
  routeLength: any;
  settings: any;

  @Exclude()
  public solutionsSteps: VRPSolutionStep[] = [];

}
