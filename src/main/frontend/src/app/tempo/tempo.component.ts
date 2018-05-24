import {Component, OnInit} from '@angular/core';
import {WorklogService, Worklog} from "../worklog.service";
import {Observable, combineLatest, concat, of, interval} from "rxjs";
import {debounce, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";
import {DayOfWeek, LocalDate} from "js-joda";
import {identity} from "rxjs/internal-compatibility";

@Component({
  selector: 'app-tempo',
  templateUrl: './tempo.component.html',
  styleUrls: ['./tempo.component.scss']
})
export class TempoComponent implements OnInit {

  detailsSubject = new Subject<boolean>();
  details$: Observable<boolean>;

  filterSubject = new Subject<string>();
  filter$: Observable<string>;

  worklogs$: Observable<Worklog[]>;
  model: WorklogAndDataSource[];

  constructor(private worklogService: WorklogService) {
  }

  ngOnInit() {
    this.filter$ = concat(of(localStorage.getItem("filter") || ""), this.filterSubject.asObservable().pipe(
      distinctUntilChanged(),
      debounce(() => interval(300))
    ));
    this.filter$.subscribe(f => localStorage.setItem("filter", f));

    this.details$ = concat(of(localStorage.getItem("showDetails") == "true"), this.detailsSubject.asObservable());
    this.details$.subscribe(f => localStorage.setItem("showDetails", f ? "true" : "false"));

    this.worklogs$ = this.worklogService.getWorklogs();

    combineLatest(this.worklogs$, this.details$, this.filter$)
      .subscribe(e => {
        const [ws, showDetails, userFilter] = e;
        ws.sort((a, b) => a.start.isEqual(b.start) ? 0 : a.start.isBefore(b.start) ? -1 : 1);
        this.model = ws.map(w => {
          if (userFilter) {
            w = {
              start: w.start,
              end: w.end,
              personalWorklogs: w.personalWorklogs.filter(pw => pw.userName.match(userFilter))
            };
          }
          return new WorklogAndDataSource(w, TempoComponent.createDataSource(w, showDetails));
        })
      });
  }

  private static createDataSource(w: Worklog, showDetails: boolean): DataSource {
    let cols = this.createColumns(w.start, w.end);

    let data = new Map<string, object[]>();

    w.personalWorklogs.forEach(pw => {
      let rows = [];
      let summary = {};
      cols.map(c => c.date)
        .filter(identity)
        .forEach(date =>
        summary[date.toString()] = 0
      );

      pw.issues.forEach(i => {
        let row = {};
        row["issue"] = i.key;
        row["url"] = i.url;
        i.loggedTime.forEach(d => {
          row[d.date.toString()] = d.seconds;
          summary[d.date.toString()] += d.seconds;
        });

        if (showDetails) {
          rows.push(row);
        }
      });

      summary["issue"] = "Summary";
      rows.push(summary);

      data[pw.userName] = rows;
    });

    return new DataSource(cols, data);
  }

  private static createColumns(start: LocalDate, end: LocalDate): Column[] {
    let columns: Column[] = [];

    let current = start;

    columns.push(new Column("issue", "Issue", null, c => c["issue"]));

    let i = 1;
    while (current <= end) {
      let idx = i++;
      let locCurrent = current;
      columns.push(new Column(`col${idx}`, `${current.dayOfMonth()}-${current.monthValue()}`, locCurrent, r => r[locCurrent.toString()]));
      current = current.plusDays(1);
    }

    return columns;
  }

  colDefs(cs: Column[]): string[] {
    return cs.map(c => c.def);
  }

  getInitialFilter(): string {
    return localStorage.getItem("filter") || "";
  }

  getInitialShowDetails(): boolean {
    return localStorage.getItem("showDetails") == "true";
  }
}

class WorklogAndDataSource {
  constructor(public worklog: Worklog,
              public dataSource: DataSource) {
  }
}

class DataSource {
  constructor(public columns: Column[],
              public data: Map<string, object[]>) {
  }
}

class Column {
  constructor(public def: string,
              public header: string,
              public date: LocalDate,
              public cellVal: (row: object) => number) {
    }

  loggedTooMuch(row: object): boolean {
    return row["issue"]==='Summary' && this.cellVal(row) > (8*3600);
  }

  loggedTooLittle(row: object): boolean {
    return row["issue"]==='Summary' && this.cellVal(row) < (2 * 3600) && (this.date.dayOfWeek() !== DayOfWeek.SATURDAY && this.date.dayOfWeek() !== DayOfWeek.SUNDAY);
  }
}
