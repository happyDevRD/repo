import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-calculadora-iva',
  templateUrl: './calculadora-iva.component.html',
  styleUrls: ['./calculadora-iva.component.css'],
})
export class CalculadoraIvaComponent {
  @Input() tipoIVA: number = 21; // Valor predeterminado del IVA
  @Input() impTotal: number = 0;
  @Input() impDto: number = 0;

  @Output() totalCalculado = new EventEmitter<{ impIva: number; impLiqui: number }>();

  impIva: number = 0;
  impLiqui: number = 0;

  calcularImportes(): void {
    const total = this.impTotal || 0;
    const descuento = this.impDto || 0;
    this.impIva = (total - descuento) * (this.tipoIVA / 100);
    this.impLiqui = total - descuento + this.impIva;

    this.totalCalculado.emit({ impIva: parseFloat(this.impIva.toFixed(2)), impLiqui: parseFloat(this.impLiqui.toFixed(2)) });
  }
}
