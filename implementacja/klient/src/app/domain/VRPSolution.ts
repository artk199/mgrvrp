import {VRPRoute} from './VRPRoute';
import {Exclude, Type} from 'class-transformer';
import {VRPSolutionStep} from './VRPSolutionStep';
import {VRPAdditionalSetting} from './VRPAdditionalSetting';

export class VRPSolution {

  @Type(() => VRPRoute)
  routes: VRPRoute[] = [];
  algorithm: string;
  distanceType: string;
  routeLength: any = 0;
  additionalSettings: VRPAdditionalSetting[];
  solutionCode: string;
  solutionState: string = 'DONE';

  @Exclude()
  public solutionsSteps: VRPSolutionStep[] = [];

  public static createInProgress(): VRPSolution {
    let solution: VRPSolution = new VRPSolution();
    solution.solutionState = 'IN_PROGRESS';
    return solution;
  }
}
