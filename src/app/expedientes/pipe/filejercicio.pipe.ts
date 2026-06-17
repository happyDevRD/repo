import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filejercicio'
})
export class FilejercicioPipe implements PipeTransform {

  transform(value: any[],campo:any, args: string): any {
    if (!value)return null;
    if (!args)return value;
    const camponmr = parseInt(campo); 
    console.log(`datos del filtro : ${camponmr}`);


    
    
        return value.filter(singleItem=>singleItem[parseInt(campo)].includes(parseInt(args)));
        //singleItem=>singleItem[campo].toLowerCase().includes(args));
       
      };

}
