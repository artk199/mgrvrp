import {VRPSolutionEvent, VrpSolverService} from './vrp-solver.service';
import {VRPProblem} from '../../domain/VRPProblem';
import {StompService, StompState} from '@stomp/ng2-stompjs';
import {MatSnackBar} from '@angular/material';
import {Message} from '@stomp/stompjs';
import {deserialize, serialize} from 'class-transformer';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {VRPSolution} from '../../domain/VRPSolution';
import {VRPAdditionalSetting} from '../../domain/VRPAdditionalSetting';


@Injectable()
export class WsVrpSolverService extends VrpSolverService {

  constructor(private _stompService: StompService, private snackBar: MatSnackBar) {
    super();
  }

  solve(problem: VRPProblem, additionalSettings: VRPAdditionalSetting[]): Observable<VRPSolutionEvent> {

    let currentState = this._stompService.state.value;
    if (currentState === StompState.CLOSED) {
      this.snackBar.open('Cannot connect to solving service.');
      return;
    }

    let stomp_subscription = this._stompService.subscribe('/topic/hello');

    let obs = stomp_subscription.map((message: Message) => {
      return message.body;
    });

    //          obs.unsubscribe();

    this._stompService.publish('/app/vrp', serialize(problem, {excludePrefixes: ['solutions']}));

    return obs.map(value => {
      let solutionEvent: VRPSolutionEvent = new VRPSolutionEvent();
      let m = JSON.parse(value);
      let messageType = m.content ? m.content.type : '';
      console.log('Dostaje wiadomosc');
      console.log(messageType);
      solutionEvent.type = messageType;
      solutionEvent.solution = deserialize(VRPSolution, JSON.stringify(m.content.message));
      solutionEvent.message = m.content.message;
      return solutionEvent;
    });
  }

}
