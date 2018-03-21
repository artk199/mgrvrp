import {VRPProblem} from '../../domain/VRPProblem';
import {Observable} from 'rxjs/Observable';
import {VRPSolution} from '../../domain/VRPSolution';
import {VRPAdditionalSetting} from '../../domain/VRPAdditionalSetting';

export class VRPSolutionEvent {
  type: string;
  solution: VRPSolution;
  message: string;
}

export class VRPSolutionEventType {
  static STEP = 'STEP';
  static INFO = 'INFO';
  static END = 'END';
  static RUNTIME_ERROR = 'RUNTIME_ERROR';
}

export abstract class VrpSolverService {
  abstract solve(problem: VRPProblem, additionalSettings: VRPAdditionalSetting[], algoritmName: string, distanceType: string): Observable<VRPSolutionEvent> ;
}
