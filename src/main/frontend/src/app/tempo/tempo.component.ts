import {Component, OnInit, Pipe, PipeTransform, Sanitizer, SecurityContext} from '@angular/core';
import {TempoService, Worklog} from "../tempo.service";
import {Observable, combineLatest, concat, of, interval} from "rxjs";
import {map, debounce, distinctUntilChanged} from "rxjs/operators";
import {Subject} from "rxjs/internal/Subject";
import {forEach} from "@angular/router/src/utils/collection";

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

  constructor(private tempoService: TempoService) {
  }

  ngOnInit() {
    this.filterSubject.asObservable().subscribe(console.log);
    this.filter$ = concat(of(""), this.filterSubject.asObservable().pipe(
      distinctUntilChanged(),
      debounce(() => interval(300))
    ));
    this.worklog = this.tempoService.getWorklogs();

    combineLatest(this.worklog, this.details$, this.filter$)
      .subscribe(e => {
        const [ws, showDetails, userFilter] = e;
        ws.sort((a, b) => a.start.getTime() - b.start.getTime());
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

      if (showDetails) {
        pw.issues.forEach(i => {
          let row = {};
          row["issue"] = i.key;
          row["url"] = i.url;
          i.hours.forEach(d => {
            row[d.date.toDateString()] = d.hours;
          });

          rows.push(row);
        });
      }

      let row = {};
      row["issue"] = "Summary";
      pw.summary.forEach(d => {
        row[d.date.toDateString()] = d.hours;
      });
      rows.push(row);

      data[pw.userName] = rows;
    });

    return new DataSource(cols, data);
  }

  private static createColumns(start: Date, end: Date): Column[] {
    let columns: Column[] = [];

    let current = new Date(start);

    columns.push(new Column("issue", "Issue", null, c => c["issue"]));

    let i = 1;
    while (current <= end) {
      let idx = i++;
      let locCurrent = new Date(current);
      columns.push(new Column(`col${idx}`, `${current.getDate()}-${current.getMonth() + 1}`, locCurrent, c => c[locCurrent.toDateString()]));
      current.setTime(current.getTime() + 86400000)
    }

    return columns;
  }

  colDefs(cs: Column[]): string[] {
    return cs.map(c => c.def);
  }

  formatDate(d: Date): string {
    return d.toISOString().split('T')[0];
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
              public date: Date,
              public cellVal: (cell: object) => string) {}
}