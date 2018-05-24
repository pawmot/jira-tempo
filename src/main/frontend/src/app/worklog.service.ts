import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {LocalDate} from "js-joda";

@Injectable()
export class WorklogService {

  constructor(private http: HttpClient) {
  }

  getWorklogs(): Observable<Worklog[]> {
    return this.http.get<Worklog[]>("/api/worklog")
      .pipe(map(ws => {
        ws.forEach(w => {
          // TODO fix the type hack with strings and LocalDate
          w.start = LocalDate.parse(<string><any>w.start);
          w.end = LocalDate.parse(<string><any>w.end);

          w.personalWorklogs.forEach(pw => {
            pw.issues.forEach(i => {
              i.loggedTime.forEach(d => {
                d.date = LocalDate.parse(<string><any>d.date);
              })
            });
          })
        });

        return ws;
      }));
  }
}

export interface Worklog {
  start: LocalDate;
  end: LocalDate;
  personalWorklogs: PersonalWorklog[]
}

export interface PersonalWorklog {
  userName: string;
  issues: IssueWorklog[];
}

export interface IssueWorklog {
  key: string;
  loggedTime: SecondsLoggedOnDate[];
  url: string;
}

export interface SecondsLoggedOnDate {
  date: LocalDate;
  seconds: number;
}
