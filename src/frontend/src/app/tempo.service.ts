import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Injectable()
export class TempoService {

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
              i.hours.forEach(d => {
                d.date = new Date(d.date);
              })
            });

            pw.summary.forEach(d => {
              d.date = new Date(d.date);
            })
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
  summary: DateHours[];
}

export interface IssueWorklog {
  key: string;
  hours: DateHours[];
  url: string;
}

export interface DateHours {
  date: Date;
  hours: string;
}
