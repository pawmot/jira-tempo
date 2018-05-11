import {Component, Directive, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Period, Settings} from "../domain/settings/settings";
import {Router} from "@angular/router";
import {SaveJiraUserDto, SaveSettingsDto, SettingsService, WorklogPeriod} from "../settings.service";
import {COMMA, ENTER, SPACE} from "@angular/cdk/keycodes";
import {MatChipInputEvent} from "@angular/material";
import {HttpErrorResponse} from "@angular/common/http";
import {AbstractControl, NG_VALIDATORS, Validator} from "@angular/forms";

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
    this.model = new Settings(null, null, null, false, [], [], [], null);
    this.settingsService.getSettings()
      .subscribe(settings => {
          this.model = new Settings(
            settings.jiraUrl,
            settings.user ? settings.user.login : null,
            null,
            settings.user ? settings.user.passwordSet : false,
            settings.users,
            settings.projects,
            settings.periods.map(p => new Period(p.start, p.end)),
            settings.version);
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof ErrorEvent) {
            console.error(`Something very bad happened:`, err.error.message)
          } else if (err.status === 404) {
            this.model = new Settings(null, null, null, false, [], [], [], null);
          }
        }
      );
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

  addPeriod(start: string, end: string) {
    if ((start || '').trim() && (end || '').trim()) {
      this.model.periods.push(new Period(start.trim(), end.trim()));
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
}

@Directive({
  selector: '[requiredIf]',
  providers: [
    {provide: NG_VALIDATORS, useExisting:RequiredIfDirective, multi: true}
  ]
})
export class RequiredIfDirective implements Validator, OnChanges {
  @Input("requiredIf")
  requiredIf: boolean;

  validate(c: AbstractControl) {
    let val = c.value;
    if (!val && this.requiredIf) {
      return {
        requiredIf: {condition: this.requiredIf}
      };
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void { this.onChange = fn; }

  private onChange: () => void;

  ngOnChanges(changes: SimpleChanges): void {
    if('requiredIf' in changes) {
      if (this.onChange) this.onChange();
    }
  }
}
