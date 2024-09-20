import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cepMask'
})
export class CepMaskPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value;
    const cleanedValue = value.replace(/\D/g, '');
    
    if (cleanedValue.length === 8) {
      return cleanedValue.replace(/(\d{2})(\d{3})(\d{3})/, '$1.$2-$3');
    }

    return value;
  }
}
