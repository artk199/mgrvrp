import {VRPProblem} from '../domain/VRPProblem';
import {Observable} from 'rxjs/Observable';
import {VRPAdditionalSetting} from '../domain/VRPAdditionalSetting';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {classToPlain, deserialize} from 'class-transformer';
import {VRPSolution} from '../domain/VRPSolution';
import {Config} from '../config';
import {Observer} from 'rxjs/Observer';
import {Subscriber} from 'rxjs/Subscriber';

export class VRPSolutionEvent {
  type: string;
  solution: VRPSolution;
  message: string;
}

export class VRPSolutionEventType {
  static MESSAGE = 'MESSAGE';
  static END = 'END';
  static ERROR = 'ERROR';
}

export class VRPCommunicationType {
  static SHORT_POLL = 'SHORT_POLL';
  static COMET = 'COMET';
  static SSE = 'SSE';
  static WEBSOCKET = 'WEBSOCKET';
}

@Injectable()
export class VrpSolverService {

  constructor(private http: HttpClient) {
  }

  solve(problem: VRPProblem, additionalSettings: VRPAdditionalSetting[], algorithmName, distanceType): Observable<VRPSolutionEvent> {

    let COMMUNICATION_TYPE = Config.getCommunicationType();

    let srv = this;
    let solveURL: string = Config.API_URL + 'vrp/solve';
    return new Observable((subscriber) => {

      this.http.post(solveURL, {
        problem: classToPlain(problem, {excludePrefixes: ['solutions', 'id']}),
        distanceType: distanceType,
        algorithm: algorithmName,
        additionalSettings: additionalSettings
      }, {
        responseType: 'text'
      }).subscribe(
        response => {

          switch (COMMUNICATION_TYPE) {
            case VRPCommunicationType.COMET:
              srv.getUpdatesComet(response, subscriber);
              break;
            case VRPCommunicationType.SHORT_POLL:
              srv.getUpdatesShortPolling(response, subscriber);
              break;
            case VRPCommunicationType.SSE:
              srv.getUpdatesServerSentEvents(response, subscriber);
              break;
            case VRPCommunicationType.WEBSOCKET:
              srv.getUpdatesWebSocket(response, subscriber);
              break;
            default:
              console.log('Communication type unselected.');
          }
        },
        error => {
          subscriber.error();
          console.log(error);
        }
      );
    });
  }

  getUpdatesComet(code: string, subscriber: Observer<VRPSolutionEvent>) {
    let url: string = Config.API_URL + 'vrp/xhrComet?code=' + code;
    let srv = this;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
      if (xhr.status != 200) {
        subscriber.error('Connection error.');
        return;
      }
      let e: VRPSolutionEvent = VrpSolverService.parseResponseToVRPSolutionEvent(xhr.response);
      subscriber.next(e);
      if (e.type == VRPSolutionEventType.MESSAGE) {
        srv.getUpdatesComet(code, subscriber);
      }
    };
    xhr.send();
  }


  getUpdatesShortPolling(code: string, subscriber: Observer<VRPSolutionEvent>) {
    let url: string = Config.API_URL + 'vrp/shortPolling?code=' + code;
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
        let e: VRPSolutionEvent = VrpSolverService.parseResponseToVRPSolutionEvent(xhr.response);
        subscriber.next(e);
        if (e.type != VRPSolutionEventType.MESSAGE) {
          clearInterval(intervalID);
        }
      };
      xhr.send();
    }, Config.SHORT_POLL_INTERVAL);
  }

  getUpdatesServerSentEvents(code: string, subscriber: Subscriber<VRPSolutionEvent>) {
    let solveURL: string = Config.API_URL + 'vrp/serverSentEvents?code=' + code;
    const source = new EventSource(solveURL);
    source.onopen = function () {
      console.log('SSE Start.');
    };
    source.onerror = function () {
      console.log('SSE Error.');
      subscriber.error();
    };
    source.onmessage = function (event) {
      let e: VRPSolutionEvent = VrpSolverService.parseResponseToVRPSolutionEvent(event.data);
      subscriber.next(e);
      if (e.type != VRPSolutionEventType.MESSAGE) {
        source.close();
      }
    };

  }

  getUpdatesWebSocket(code: string, subscriber: Subscriber<VRPSolutionEvent>) {
    let base_url = Config.API_URL.replace(/^http:\/\//i, 'ws://');
    let solveURL: string = base_url + 'socket?code=' + code;
    let socket = new WebSocket(solveURL);
    socket.onopen = function () {
      console.log('Opening websocket');
    };
    socket.onmessage = function (message) {
      let e: VRPSolutionEvent = VrpSolverService.parseResponseToVRPSolutionEvent(message.data);
      subscriber.next(e);
    };
    socket.onclose = function () {
      console.log('Closing websocket.');
    };
    socket.onerror = function () {
      subscriber.error();
      console.log('Websocket error!');
    };
  }


  private static parseResponseToVRPSolutionEvent(data: string): VRPSolutionEvent {
    let response = JSON.parse(data);
    let event: VRPSolutionEvent = new VRPSolutionEvent();
    event.type = response.eventType.name;
    event.message = response.message;
    event.solution = deserialize(VRPSolution, JSON.stringify(response.solution));
    return event;
  }

}
