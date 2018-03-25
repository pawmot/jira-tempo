import {Component, OnInit} from '@angular/core';
import {Period, Settings} from "../domain/settings/settings";
import {Router} from "@angular/router";
import {SaveJiraUserDto, SaveSettingsDto, SettingsService, WorklogPeriod} from "../settings.service";
import {CompletionObserver} from "rxjs/src/Observer";
import {Observer} from "rxjs/Observer";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  model: Settings;
  separatorKeysCodes = [ENTER, COMMA, SPACE];

  constructor(private router: Router, private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.model = new Settings(null, null, null, null, null, null, null);
    this.settingsService.getSettings()
      .subscribe(settings => {
        if (settings != null) {
          this.model = new Settings(
            settings.jiraUrl,
            settings.user ? settings.user.login : null,
            null,
            settings.users,
            settings.projects,
            settings.periods.map(p => new Period(p.start, p.end)),
            settings.version);
        } else {
          this.model = new Settings(null, null, null, null, null, null, null);
        }
      });
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }

  addUser(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      this.model.users.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeUser(user: any): void {
    let index = this.model.users.indexOf(user);

    if (index >= 0) {
      this.model.users.splice(index, 1);
    }
  }

  addProject(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    if ((value || '').trim()) {
      this.model.projects.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeProject(project: any): void {
    let index = this.model.projects.indexOf(project);

    if (index >= 0) {
      this.model.projects.splice(index, 1);
    }
  }

  removePeriod(period: any) {
    let index = this.model.periods.indexOf(period);

    if (index >= 0) {
      this.model.periods.splice(index, 1);
    }
  }

  onSubmit() {
    let dto = <SaveSettingsDto>{};
    dto.jiraUrl = this.model.url;
    dto.user = <SaveJiraUserDto>{};
    dto.user.login = this.model.user;
    dto.user.password = this.model.password;
    dto.users = this.model.users;
    dto.projects = this.model.projects;
    dto.periods = this.model.periods.map(p => <WorklogPeriod>p);
    dto.version = this.model.version;

    this.settingsService.saveSettings(dto)
      .subscribe(_ => {
        this.goToHome();
      });
  }

  addPeriod(start: string, end: string) {
    if ((start || '').trim() && (end || '').trim()) {
      this.model.periods.push(new Period(start.trim(), end.trim()));
    }
  }
}
