import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'digitPlace'
})
export class DigitPlacePipe implements PipeTransform {
  transform(value: number): string {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

}
