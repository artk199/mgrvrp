import {Injectable} from '@angular/core';
import {LogConsole, LogLocalStorage, LogPublisher, LogPublisherConfig} from './log-publisher';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const PUBLISHER_FILE = 'assets/log-publishers.json';

@Injectable()
export class LogPublishersService {
  publishers: LogPublisher[] = [];

  constructor(private http: Http) {
    this.buildPublishers();
  }

  buildPublishers(): void {
    let logPub: LogPublisher;
    this.getLoggers().subscribe(response => {
        for (const pub of response.filter(p => p.isActive)) {
          switch (pub.loggerName.toLowerCase()) {
            case 'console':
              logPub = new LogConsole();
              break;
            case 'localstorage':
              logPub = new LogLocalStorage();
              break;
          }
          this.publishers.push(logPub);
        }
      }
    );
  }

  getLoggers(): Observable<LogPublisherConfig[]> {
    return this.http.get(PUBLISHER_FILE)
      .map(response => response.json())
      .catch(this.handleErrors);
  }

  private handleErrors(error: any): Observable<any> {
    const errors: string[] = [];
    let msg = '';
    msg = 'Status: ' + error.status;
    msg += ' - Status Text: ' + error.statusText;
    if (error.json()) {
      msg += ' - Exception Message: ' + error.json().exceptionMessage;
    }
    errors.push(msg);
    console.error('An error occurred', errors);
    return Observable.throw(errors);
  }
}
