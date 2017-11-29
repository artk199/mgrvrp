import {Observable} from 'rxjs/Observable';
import {LogEntry} from './log-entry';
import 'rxjs/add/observable/of';

export abstract class LogPublisher {
  location: string;

  abstract log(record: LogEntry): Observable<boolean>;

  abstract clear(): Observable<boolean>;
}

export class LogPublisherConfig {
  loggerName: string;
  isActive: boolean;
}

export class LogConsole extends LogPublisher {
  log(entry: LogEntry): Observable<boolean> {
    console.log(entry.buildLogString());
    return Observable.of(true);
  }

  clear(): Observable<boolean> {
    console.clear();
    return Observable.of(true);
  }
}

export class LogLocalStorage extends LogPublisher {

  constructor() {
    super();
    this.location = 'logging';
  }

  log(record: LogEntry): Observable<boolean> {
    let ret = false;
    let values: LogEntry[];
    try {
      values = JSON.parse(localStorage.getItem(this.location)) || [];
      values.push(record);
      localStorage.setItem(this.location, JSON.stringify(values));
      ret = true;
    } catch (ex) {
      console.log(ex);
    }
    return Observable.of(ret);
  }

  clear(): Observable<boolean> {
    localStorage.removeItem(this.location);
    return Observable.of(true);
  }

  getAll(): Observable<LogEntry[]> {
    let values: LogEntry[];
    values = JSON.parse(localStorage.getItem(this.location));
    return Observable.of(values);
  }

}

