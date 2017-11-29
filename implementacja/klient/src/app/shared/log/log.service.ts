import {Injectable} from '@angular/core';
import {LogPublishersService} from './log-publishers.service';
import {LogPublisher} from './log-publisher';
import {LogEntry} from './log-entry';
import {LogLevel} from './log-level';

@Injectable()
export class LogService {
  level: LogLevel = LogLevel.All;
  logWithDate: true;
  publishers: LogPublisher[] = [];

  constructor(private publishersService: LogPublishersService) {
    this.publishers = publishersService.publishers;
  }

  log(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  debug(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: any, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  clear() {
    for (const logger of this.publishers) {
      logger.clear().subscribe(response => console.log(response));
    }
  }

  private shouldLog(level: LogLevel): boolean {
    let ret = false;
    if (this.level !== LogLevel.Off && level >= this.level) {
      ret = true;
    }
    return ret;
  }

  private writeToLog(msg: any, level: LogLevel, ...optionalParams: any[]) {
    if (this.shouldLog(level)) {
      const entry = new LogEntry();
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = optionalParams;
      entry.logWithDate = this.logWithDate;

      for (const logger of this.publishers) {
        logger.log(entry).subscribe(response => console.log(response));
      }
    }
  }

  private formatParams(params: any[]): string {
    let ret: string = params.join(',');
    if (params.some(p => typeof p === 'object')) {
      ret = '';
      for (const item of params) {
        ret += JSON.stringify(item) + ',';
      }
    }
    return ret;
  }
}
