import {NgModule} from "@angular/core";
import {MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatToolbarModule} from "@angular/material";

@NgModule({
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  exports: [MatToolbarModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule]
})
export class NgDepsModule {}
