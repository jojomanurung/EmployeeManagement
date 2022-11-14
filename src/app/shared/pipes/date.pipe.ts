import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentDate',
  standalone: true,
})
export class MomentDatePipe implements PipeTransform {
  transform(value: Date, dateFormat: string): string {
    const result = moment(value).format(dateFormat);
    return result;
  }
}
