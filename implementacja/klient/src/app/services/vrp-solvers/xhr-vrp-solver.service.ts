import {VRPSolutionEvent, VrpSolverService} from './vrp-solver.service';
import {Injectable} from '@angular/core';
import {VRPProblem} from '../../domain/VRPProblem';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {VRPAdditionalSetting} from '../../domain/VRPAdditionalSetting';
import {classToPlain, deserialize, plainToClass} from 'class-transformer';
import {VRPSolution} from '../../domain/VRPSolution';
import {Config} from '../../config';
import {Observer} from 'rxjs/Observer';
import {Subscriber} from 'rxjs/Subscriber';

@Injectable()
export class XhrVrpSolverService extends VrpSolverService {

  constructor(private http: HttpClient) {
    super();
  }

  getUpdates(url: string, subscriber: Observer<VRPSolutionEvent>) {
    let srv = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (xhr.status != 200) {
        subscriber.error('Connection error.');
        return;
      }
      let response = JSON.parse(xhr.response);
      console.log(response);
      let endCondition = response.eventType.name != 'MESSAGE';
      let evnt: VRPSolutionEvent = new VRPSolutionEvent();
      evnt.type = response.eventType.name;
      evnt.message = response.message;
      evnt.solution = deserialize(VRPSolution, JSON.stringify(response.solution));
      subscriber.next(evnt);
      if (!endCondition) {
        srv.getUpdates(url, subscriber);
      }

    };
    xhr.send();
  }

  getUpdatesShortPolling(url: string, subscriber: Observer<VRPSolutionEvent>) {
    let srv = this;
    let intervalID = setInterval(function () {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = function () {
        if (xhr.status != 200) {
          subscriber.error('Connection error.');
          return;
        }
        if (xhr.response == '') {
          return;
        }
        let response = JSON.parse(xhr.response);
        let endCondition = response.eventType.name != 'MESSAGE';
        let evnt: VRPSolutionEvent = new VRPSolutionEvent();
        evnt.type = response.eventType.name;
        evnt.message = response.message;
        evnt.solution = deserialize(VRPSolution, JSON.stringify(response.solution));
        subscriber.next(evnt);
        if (endCondition) {
          clearInterval(intervalID);
        }
      };
      xhr.send();
    }, Config.SHORT_POLL_INTERVAL);
  }


  getUpdatesServerSentEvents(solveURL: string, subscriber: Subscriber<VRPSolutionEvent>) {
    const source = new EventSource(solveURL);
    source.onopen = function () {
      console.log('sse start');
    };
    source.onmessage = function (event) {
      let response = JSON.parse(event.data);
      let endCondition = response.eventType.name != 'MESSAGE';
      let evnt: VRPSolutionEvent = new VRPSolutionEvent();
      evnt.type = response.eventType.name;
      evnt.message = response.message;
      evnt.solution = deserialize(VRPSolution, JSON.stringify(response.solution));
      subscriber.next(evnt);
      if (endCondition) {
        source.close();
      }
    };

  }

  solve(problem: VRPProblem, additionalSettings: VRPAdditionalSetting[], algorithmName, distanceType): Observable<VRPSolutionEvent> {
    let srv = this;
    let solveURL: string = Config.API_URL + 'vrp/solve';
    return new Observable((subscriber) => {

      this.http.post(solveURL, {
        problem: classToPlain(problem, {excludePrefixes: ['solutions']}),
        distanceType: distanceType,
        algorithm: algorithmName,
        additionalSettings: additionalSettings
      }, {
        responseType: 'text'
      }).subscribe(
        response => {

          //let solveURL: string = Config.API_URL + 'vrp/xhrComet?code=' + response;
          //srv.getUpdatesComet(solveURL, subscriber);

          //let solveURL: string = Config.API_URL + 'vrp/shortPolling?code=' + response;
          //srv.getUpdatesShortPolling(solveURL, subscriber);

          let solveURL: string = Config.API_URL + 'vrp/serverSentEvents?code=' + response;
          srv.getUpdatesServerSentEvents(solveURL, subscriber);


        },
        error => console.log(error)
      );
    });
  }


}
