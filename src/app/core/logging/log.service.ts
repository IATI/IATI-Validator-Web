/* eslint-disable max-classes-per-file,no-shadow,@typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';

import { LogPublishersService } from './log-publishers.service';
import { LogPublisher } from './log-publishers';

// Source: http://www.codemag.com/article/1711021
// ****************************************************
// Log Level Enumeration
// ****************************************************
export enum LogLevel {
  All = 0,
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Fatal = 5,
  Off = 6
}

// ****************************************************
// Log Entry Class
// ****************************************************
export class LogEntry {
  // Public Properties
  entryDate: Date = new Date();
  message = '';
  level: LogLevel = LogLevel.Debug;
  extraInfo: any[] = [];
  logWithDate = true;

  // **************
  // Public Methods
  // **************
  buildLogString(): string {
    let value = '';

    if (this.logWithDate) {
      value = new Date() + ' - ';
    }
    value += 'Type: ' + LogLevel[this.level];
    value += ' - Message: ' + this.message;
    if (this.extraInfo.length) {
      value += ' - Extra Info: '
        + this.formatParams(this.extraInfo);
    }

    return value;
  }

  // ***************
  // Private Methods
  // ***************
  private formatParams(params: any[]): string {
    let ret: string = params.join(',');

    // Is there at least one object in the array?
    if (params.some(p => typeof p === 'object')) {
      ret = '';
      // Build comma-delimited string
      for (const item of params) {
        ret += JSON.stringify(item) + ',';
      }
    }

    return ret;
  }
}

// ****************************************************
// Log Service Class
// ****************************************************
@Injectable()
export class LogService {
  // Public Properties
  publishers: LogPublisher[];
  level: LogLevel = LogLevel.All;
  logWithDate = true;

  constructor(private publishersService: LogPublishersService) {
    // Set publishers
    this.publishers = this.publishersService.publishers;
  }

  // *************************
  // Public methods
  // *************************
  debug(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Debug, optionalParams);
  }

  info(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Info, optionalParams);
  }

  warn(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Warn, optionalParams);
  }

  error(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Error, optionalParams);
  }

  fatal(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.Fatal, optionalParams);
  }

  log(msg: string, ...optionalParams: any[]) {
    this.writeToLog(msg, LogLevel.All, optionalParams);
  }

  clear(): void {
    for (const logger of this.publishers) {
      logger.clear()
        .subscribe(response => console.log(response));
    }
  }

  // *************************
  // Private methods
  // *************************
  private shouldLog(level: LogLevel): boolean {
    let ret = false;

    if ((level >= this.level &&
      level !== LogLevel.Off) ||
      this.level === LogLevel.All) {
      ret = true;
    }

    return ret;
  }

  private writeToLog(msg: string, level: LogLevel, params: any[]) {
    if (this.shouldLog(level)) {
      // Declare variables
      const entry: LogEntry = new LogEntry();

      // Build Log Entry
      entry.message = msg;
      entry.level = level;
      entry.extraInfo = params;
      entry.logWithDate = this.logWithDate;

      for (const logger of this.publishers) {
        logger.log(entry)
          .subscribe(response => '' );
          // .subscribe(response => console.log(response));
      }
    }
  }
}
