import {VRPSolutionEvent, VrpSolverService} from './vrp-solver.service';
import {Injectable} from '@angular/core';
import {VRPProblem} from '../../domain/VRPProblem';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {VRPAdditionalSetting} from '../../domain/VRPAdditionalSetting';
import {classToPlain, plainToClass} from 'class-transformer';
import {VRPSolution} from '../../domain/VRPSolution';

@Injectable()
export class XhrVrpSolverService extends VrpSolverService {

  constructor(private http: HttpClient) {
    super();
  }

  solve(problem: VRPProblem, additionalSettings: VRPAdditionalSetting[], algorithmName, distanceType): Observable<VRPSolutionEvent> {
    let obs = this.http.post('http://localhost:9090/vrp/vrp_xhr', {
      problem: classToPlain(problem, {excludePrefixes: ['solutions']}),
      distanceType: distanceType,
      algorithm: algorithmName,
      additionalSettings: additionalSettings
    });
    return obs.map(value => {
      console.log(value);
      let solutionEvent: VRPSolutionEvent = new VRPSolutionEvent();
      solutionEvent.type = value['type'];
      solutionEvent.solution = plainToClass(VRPSolution, value['message'] as VRPSolution);
      solutionEvent.message = value['message'];
      /*
      let solutionEvent: VRPSolutionEvent = new VRPSolutionEvent();
      let m = JSON.parse(value);
      let messageType = m.content ? m.content.type : '';
      console.log('Dostaje wiadomosc');
      console.log(messageType);
      solutionEvent.type = messageType;

      solutionEvent.message = m.content.message;
      return solutionEvent;
      */
      console.log(plainToClass(VRPSolution, value['message']));
      return solutionEvent;
    });
  }

}
