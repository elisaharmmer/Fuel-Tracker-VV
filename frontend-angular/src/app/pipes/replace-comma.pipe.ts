import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replaceComma'
})
export class ReplaceCommaPipe implements PipeTransform {
  transform(value: string | number | null): string {
    if (value === null) {
      return '--';
    }

    // Convert string to number if necessary
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    return numericValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 3 });
  }
}
