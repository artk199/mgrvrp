import {LogLevel} from './log-level';

export class LogEntry {
  entryDate: Date = new Date();
  message = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate = true;

  buildLogString(): string {
    let ret = '';
    if (this.logWithDate) {
      ret += new Date() + ': ';
    }
    ret += '[' + LogLevel[this.level] + '] ';
    ret += JSON.stringify(this.message);
    if (this.extraInfo.length) {
      ret += ' : ' + this.formatParams(this.extraInfo);
    }
    return ret;
  }

  private formatParams(params: any[]): string {
    return '';
  }

}
