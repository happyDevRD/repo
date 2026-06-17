import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filrepresentante'
})
export class FilrepresentantePipe implements PipeTransform {

 
  
  transform(value: any[],campo:string, ...args: any[]): any {
    if (!value)return null;
    if (!campo)return null;
    if (!args)return value;
    
    
        return value.filter(
          singleItem=>singleItem[campo].toLowerCase().includes(args));
      };

}
