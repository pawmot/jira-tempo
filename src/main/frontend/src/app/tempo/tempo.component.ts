import {Component, OnInit} from '@angular/core';
import {WorklogService, Worklog} from "../worklog.service";
import {Observable, combineLatest, concat, of, interval} from "rxjs";
import {debounce, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";
import {LocalDate} from "js-joda";

@Component({
  selector: 'app-tempo',
  templateUrl: './tempo.component.html',
  styleUrls: ['./tempo.component.scss']
})
export class TempoComponent implements OnInit {

  detailsSubject = new Subject<boolean>();
  details$ = this.detailsSubject.asObservable();

  filterSubject = new Subject<string>();
  filter$: Observable<string>;

  worklog: Observable<Worklog[]>;
  model: WorklogAndDataSource[];

  constructor(private worklogService: WorklogService) {
  }

  ngOnInit() {
    this.filterSubject.asObservable().subscribe(console.log);
    this.filter$ = concat(of(""), this.filterSubject.asObservable().pipe(
      distinctUntilChanged(),
      debounce(() => interval(300))
    ));
    this.worklog = this.worklogService.getWorklogs();

    combineLatest(this.worklog, this.details$, this.filter$)
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

    this.detailsSubject.next(false);
  }

  private static createDataSource(w: Worklog, showDetails: boolean): DataSource {
    let cols = this.createColumns(w.start, w.end);

    let data = new Map<string, object[]>();

    w.personalWorklogs.forEach(pw => {
      let rows = [];
      let summary = {};

      pw.issues.forEach(i => {
        let row = {};
        row["issue"] = i.key;
        row["url"] = i.url;
        i.loggedTime.forEach(d => {
          row[d.date.toString()] = d.seconds;
          if (!summary[d.date.toString()]) {
            summary[d.date.toString()] = d.seconds;
          } else {
            summary[d.date.toString()] += d.seconds;
          }
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
      columns.push(new Column(`col${idx}`, `${current.dayOfMonth()}-${current.monthValue()}`, locCurrent, c => c[locCurrent.toString()]));
      current = current.plusDays(1);
    }

    return columns;
  }

  colDefs(cs: Column[]): string[] {
    return cs.map(c => c.def);
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
              public cellVal: (cell: object) => string) {
  }
}
