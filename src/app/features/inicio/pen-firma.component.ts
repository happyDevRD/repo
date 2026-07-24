import { Component } from '@angular/core';

@Component({
  selector: 'app-pen-firma',
  templateUrl: './pen-firma.component.html',
  styleUrls: ['./pen-firma.component.css']
})
export class PenFirmaComponent {
  public localizationObject: any = {
    pagergotopagestring: 'Ir a:',
    pagershowrowsstring: 'Mostrar:',
    pagerrangestring: ' de ',
    pagerpreviousbuttonstring: 'Anterior',
    pagernextbuttonstring: 'Siguiente'
  };

  public columns: any[] = [
    { text: 'Descripción', datafield: 'descripcion', width: '40%' },
    { text: 'Departamento', datafield: 'departamento', width: '30%' },
    { text: 'Código SIA', datafield: 'codsia', width: '30%' }
  ];

  public source: any = new jqx.dataAdapter({
    localData: [],
    datafields: [
      { name: 'descripcion', type: 'string' },
      { name: 'departamento', type: 'string' },
      { name: 'codsia', type: 'string' }
    ]
  });
}
