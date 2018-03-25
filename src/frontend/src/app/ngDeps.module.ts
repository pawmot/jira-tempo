import {NgModule} from "@angular/core";
import {
  MatButtonModule, MatChipsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatListModule, MatTableModule,
  MatToolbarModule
} from "@angular/material";

@NgModule({
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatListModule, MatTableModule],
  exports: [MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatChipsModule, MatListModule, MatTableModule]
})
export class NgDepsModule {}
