import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';
import {PartialObserver} from "rxjs/Observer";

@Injectable()
export class SettingsService {

  constructor(private http: HttpClient) {
  }

  getSettings(): Observable<ReadSettingsDto> {
    return this.http.get("/api/settings")
      .map(r => <ReadSettingsDto>r);
  }

  saveSettings(dto: SaveSettingsDto): Observable<object> {
    console.log(`Saving ${dto}`);
    return this.http.put("/api/settings", dto);
  }
}

export interface ReadSettingsDto {
  jiraUrl: string;
  user: ReadJiraUserDto;
  version: number;
}

export interface ReadJiraUserDto {
  login: string;
}

export interface SaveSettingsDto {
  jiraUrl: string;
  user: SaveJiraUserDto;
  version: number;
}

export interface SaveJiraUserDto {
  login: string;
  password: string;
}
