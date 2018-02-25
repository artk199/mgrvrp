import {VRPRoute} from './VRPRoute';
import {Exclude, Type} from 'class-transformer';
import {VRPSolutionStep} from './VRPSolutionStep';
import {VRPAlgorithm} from './VRPAlgorithm';

export class VRPSolution {

  @Type(() => VRPRoute)
  routes: VRPRoute[];
  algorithm: VRPAlgorithm;
  routeLength: any;
  settings: any;

  @Exclude()
  public solutionsSteps: VRPSolutionStep[] = [];

}
