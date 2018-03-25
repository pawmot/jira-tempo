import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

@Injectable()
export class TempoService {

  constructor(private http: HttpClient) {
  }

  getWorklogs(): Observable<Worklog[]> {
    return this.http.get("/api/worklog")
      .map(r => <Worklog[]>r)
      .map(ws => {
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
      });
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
}

export interface DateHours {
  date: Date;
  hours: string;
}
