import {VRPCommunicationType} from './services/vrp-solver.service';

export class Config {

  static COMMUNICATION_KEY: string = 'COMMUNICATION_KEY';

  static API_URL = 'http://145.239.81.184:8080/';
  //static API_URL = 'http://localhost:9090/';
  static SHORT_POLL_INTERVAL: number = 200;
  static SAVE_TYPE = 'DATABASE';

  static getCommunicationType(): string {
    let type = window.localStorage.getItem(Config.COMMUNICATION_KEY);
    if (type)
      return type;
    return Config.isSSEDisabled() ? 'COMET' : 'SSE';
  }

  static setCommunicationType(type: string) {
    window.localStorage.setItem(Config.COMMUNICATION_KEY, type);
  }

  static isSSEDisabled(): boolean {
    return false;
  }

  static isWebSocketDisabled() {
    return false;
  }
}
