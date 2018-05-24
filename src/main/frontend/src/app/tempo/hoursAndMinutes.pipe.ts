import {Pipe, PipeTransform} from "@angular/core";

@Pipe({
  name: 'hoursAndMinutes'
})
export class HoursAndMinutesPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) {
      return "";
    }

    let hours = Math.floor(value/3600);
    let minutes = Math.ceil((value % 3600)/60);
    return `${hours}h ${minutes}m`;
  }
}
