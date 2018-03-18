import {Component, OnInit} from '@angular/core';
import {Settings} from "../domain/settings/settings";
import {Router} from "@angular/router";
import {SaveJiraUserDto, SaveSettingsDto, SettingsService} from "../settings.service";
import {CompletionObserver} from "rxjs/src/Observer";
import {Observer} from "rxjs/Observer";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  model: Settings;

  constructor(private router: Router, private settingsService: SettingsService) {
  }

  ngOnInit() {
    this.model = new Settings(null, null, null, null);
    this.settingsService.getSettings()
      .subscribe(settings => {
        if (settings != null) {
          this.model = new Settings(settings.jiraUrl, settings.user ? settings.user.login : null, null, settings.version);
        } else {
          this.model = new Settings(null, null, null, null);
        }
      });
  }

  goToHome() {
    this.router.navigateByUrl('/');
  }

  onSubmit() {
    let dto = <SaveSettingsDto>{};
    dto.jiraUrl = this.model.url;
    dto.user = <SaveJiraUserDto>{};
    dto.user.login = this.model.user;
    dto.user.password = this.model.password;
    dto.version = this.model.version;

    this.settingsService.saveSettings(dto)
      .subscribe(_ => {
        this.goToHome();
      });
  }
}
