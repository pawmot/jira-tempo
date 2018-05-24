import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';


import {AppComponent} from './app.component';
import {NgDepsModule} from "./ngDeps.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {RouterModule, Routes} from "@angular/router";
import {environment} from "../environments/environment";
import {RequiredIfDirective, SettingsComponent} from './settings/settings.component';
import {SettingsService} from './settings.service';
import {FormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {TempoComponent} from './tempo/tempo.component';
import {WorklogService} from './worklog.service';
import {HoursAndMinutesPipe} from "./tempo/hoursAndMinutes.pipe";

const appRoutes: Routes = [
  {path: 'settings', component: SettingsComponent},
  {path: '', component: TempoComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    TempoComponent,
    RequiredIfDirective,
    HoursAndMinutesPipe
  ],
  imports: [
    BrowserModule,
    NgDepsModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      {enableTracing: !environment.production}
    )
  ],
  providers: [SettingsService, WorklogService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
