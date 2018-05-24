import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class WorklogService {

  constructor(private http: HttpClient) {
  }

  getWorklogs(): Observable<Worklog[]> {
    return this.http.get<Worklog[]>("/api/worklog")
      .pipe(map(ws => {
        ws.forEach(w => {
          w.start = new Date(w.start);
          w.end = new Date(w.end);

          w.personalWorklogs.forEach(pw => {
            pw.issues.forEach(i => {
              i.loggedTime.forEach(d => {
                console.log(d.date);
                d.date = new Date(d.date);
              })
            });
          })
        });

        return ws;
      }));
  }
}

export interface Worklog {
  start: Date;
  end: Date;
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
  date: Date;
  seconds: number;
}
