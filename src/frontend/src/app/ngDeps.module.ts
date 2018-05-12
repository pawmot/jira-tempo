import {NgModule} from "@angular/core";
import {
  MatButtonModule,
  MatChipsModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from "@angular/material";

const ngMods = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatChipsModule,
  MatListModule,
  MatTableModule,
  MatTabsModule,
  MatSidenavModule,
  MatSlideToggleModule];

@NgModule({
  imports: ngMods,
  exports: ngMods
})
export class NgDepsModule {
}
