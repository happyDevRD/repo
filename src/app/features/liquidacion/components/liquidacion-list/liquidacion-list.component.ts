import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LiquidacionDto} from "../../models/liquidacion.dto";
import {LiquidacionService} from "../../services/liquidacion.service";
import {jqxGrid_ES} from "../../../../../translations/jqxGrid_translate";

@Component({
  selector: 'app-liquidacion-list',
  templateUrl: './liquidacion-list.component.html',
  styleUrls: ['./liquidacion-list.component.css']
})
export class LiquidacionListComponent implements OnInit, OnChanges {
  @Input() idExped: number;
  liquidaciones: LiquidacionDto[] = [];
  dataAdapter: any;
  columns: any[];
  localizationObject = jqxGrid_ES;

  constructor(private liquidacionService: LiquidacionService) { }

  ngOnInit(): void {
    this.columns = [
      { text: 'Tipo Liquidación', datafield: 'tipLiqui', width: '15%', cellsrenderer: this.tipoLiquidacionRenderer.bind(this) },
      { text: 'Cuota',            datafield: 'cuoLiqui', width: '15%', cellsrenderer: this.currencyRenderer.bind(this) },
      { text: 'Bonificación (%)', datafield: 'porBonif', width: '15%' },
      { text: 'Demora',           datafield: 'intDemor', width: '15%', cellsrenderer: this.currencyRenderer.bind(this) },
      { text: 'Sanción',          datafield: 'impSanci', width: '15%', cellsrenderer: this.currencyRenderer.bind(this) },
      { text: 'Recargo',          datafield: 'impVario', width: '15%', cellsrenderer: this.currencyRenderer.bind(this) },
      { text: 'Total',            datafield: 'totLiqui', width: '15%', cellsrenderer: this.currencyRenderer.bind(this) }
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idExped'] && this.idExped) {
      this.loadLiquidaciones();
    }
  }

  loadLiquidaciones(): void {
    this.liquidacionService.listLiquidaciones(this.idExped).subscribe(
      (data) => {
        this.liquidaciones = data;
        this.dataAdapter = new jqx.dataAdapter({
          localdata: this.liquidaciones,
          datatype: 'array',
          datafields: [
            { name: 'tipLiqui', type: 'number' },
            { name: 'cuoLiqui', type: 'number' },
            { name: 'porBonif', type: 'number' },
            { name: 'intDemor', type: 'number' },
            { name: 'impSanci', type: 'number' },
            { name: 'impVario', type: 'number' },
            { name: 'totLiqui', type: 'number' }
          ]
        });
      },
      error => {
        console.error("Error al cargar liquidaciones", error);
      }
    );
  }

  currencyRenderer(row: number, column: string, value: any): string {
    const num = Number(value) || 0;
    return `<div style="text-align: right; margin-top: 4px;">€ ${num.toFixed(2)}</div>`;
  }

  tipoLiquidacionRenderer(row: number, column: string, value: number): string {
    let label = value === 1 ? 'Liquidación' : value === 2 ? 'Autoliquidación' : '';
    return `<div style="text-align: center; margin-top: 4px;">${label}</div>`;
  }
}
