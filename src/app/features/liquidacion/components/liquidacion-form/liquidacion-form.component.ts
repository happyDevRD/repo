import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LiquidacionDto} from "../../models/liquidacion.dto";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from "sweetalert2";
import {LiquidacionService} from "../../services/liquidacion.service";
import {UserSessionService} from "../../../../core/service/user-session.service";

@Component({
  selector: 'app-liquidacion-form',
  templateUrl: './liquidacion-form.component.html',
  styleUrls: ['./liquidacion-form.component.css']
})
export class LiquidacionFormComponent implements OnInit, OnChanges {
  @Input() idExped: number;
  @Input() tipoObjTribDesc: string;
  @Input() idTipObjTribu: number;
  @Input() idHisTipObjTribu: number;

  public nombreInteresado: string = '';

  localIdTipObjTribu: number;
  localIdHisTipObjTribu: number;
  localTipoObjTribDesc: string;

  // Configuración para ngx-currency (formato en euros)
  public currencyOptions = {
    align: 'right',
    allowNegative: false,
    decimal: ',',
    precision: 2,
    prefix: ' ',
    suffix: ' €',
    thousands: '.'
  };

  liquidacion: LiquidacionDto = {
    tipLiqui      : 1,
    idExped       : 0,
    porBonif      : 0.00,
    cuoLiqui      : 0.00,
    impBonLiqui   : 0.00,
    impSanci      : 0.00,
    desSanci      : '',
    impVario      : 0.00,
    desVario      : '',
    intDemor      : 0.00,
    desIntDemor   : '',
    totLiqui      : 0.00,
    observaciones : '',
    usuContr      : ''
  };

  constructor(
    private liquidacionService: LiquidacionService,
    private session: UserSessionService
  ) { }

  get user(): string | null {
    return this.session.user;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idTipObjTribu']) {
      this.localIdTipObjTribu = changes['idTipObjTribu'].currentValue;
    }
    if (changes['idHisTipObjTribu']) {
      this.localIdHisTipObjTribu = changes['idHisTipObjTribu'].currentValue;
    }
    if (changes['tipoObjTribDesc']) {
      this.localTipoObjTribDesc = changes['tipoObjTribDesc'].currentValue;
    }

    if (changes['idExped'] && changes['idExped'].currentValue) {
      this.liquidacion.idExped = changes['idExped'].currentValue;
      this.fetchInteresado();
    }
  }

  ngOnInit(): void {
    if (this.idExped) {
      this.liquidacion.idExped = this.idExped;
    }
    this.calculaTotal();
    if (this.liquidacion.idExped) {
      this.fetchInteresado();
    }
  }

  fetchInteresado(): void {
    if (!this.liquidacion.idExped) {
      console.warn('[fetchInteresado] idExped es undefined, no se puede obtener el interesado');
      this.nombreInteresado = 'ID de expediente no disponible';
      return;
    }
    
    this.liquidacionService.getInteresadoExp(this.liquidacion.idExped).subscribe({
      next: (data: any) => {
        if (data && data.perEntid && data.perEntid.nombre) {
          this.nombreInteresado = data.perEntid.nombre;
        } else {
          console.warn("[fetchInteresado] No se encontró 'perEntid.nombre'. Data:", data);
          this.nombreInteresado = 'Nombre no disponible';
        }
      },
      error: (error) => {
        console.error('[fetchInteresado] Error al obtener el interesado', error);
        this.nombreInteresado = 'Error al cargar el nombre';
      }
    });
  }


  calculaTotal(): void {
    const cuota = this.liquidacion.cuoLiqui || 0;
    const porBonif = this.liquidacion.porBonif || 0;
    const demora = this.liquidacion.intDemor || 0;
    const sancion = this.liquidacion.impSanci || 0;
    const recargo = this.liquidacion.impVario || 0;

    if (porBonif < 0 || porBonif > 100) {
      Swal.fire('Error', 'El porcentaje de bonificación debe estar entre 0 y 100.', 'error').then();
      return;
    }
    if (cuota < 0 || demora < 0 || sancion < 0 || recargo < 0) {
      Swal.fire('Error', 'Los valores numéricos no pueden ser negativos.', 'error').then();
      return;
    }

    const total = cuota - (cuota * porBonif / 100) + demora + sancion + recargo;
    // Redondeo a 2 decimales
    this.liquidacion.totLiqui = Math.round(total * 100) / 100;
  }

  currencyRenderer(row: number, column: string, value: any): string {
    const num = Number(value) || 0;
    return `<div style="text-align: right; margin-top: 4px;">€ ${num.toFixed(2)}</div>`;
  }

  onSubmit(): void {
    // Validaciones básicas para los campos obligatorios
    if (this.liquidacion.cuoLiqui == null || isNaN(this.liquidacion.cuoLiqui)) {
      Swal.fire('Error', 'El campo "Cuota" no puede estar vacío.', 'error').then(r => r);
      return;
    }
    if (this.liquidacion.porBonif == null || isNaN(this.liquidacion.porBonif)) {
      Swal.fire('Error', 'El campo "Porcentaje de Bonificación" no puede estar vacío.', 'error').then(r => r);
      return;
    }
    if (this.liquidacion.impSanci == null || isNaN(this.liquidacion.impSanci)) {
      Swal.fire('Error', 'El campo "Sanción" no puede estar vacío.', 'error').then(r => r);
      return;
    }
    if (this.liquidacion.intDemor == null || isNaN(this.liquidacion.intDemor)) {
      Swal.fire('Error', 'El campo "Demora" no puede estar vacío.', 'error').then(r => r);
      return;
    }
    if (this.liquidacion.impVario == null || isNaN(this.liquidacion.impVario)) {
      Swal.fire('Error', 'El campo "Recargo" no puede estar vacío.', 'error').then(r => r);
      return;
    }

    // Asignar usuario y expediente
    this.liquidacion.usuContr = this.user ? this.user : 'No User';
    this.liquidacion.idExped = this.idExped;


    this.liquidacionService.createLiquidacion(
      this.liquidacion,
      this.idTipObjTribu,
      this.idHisTipObjTribu,
      this.tipoObjTribDesc
    ).subscribe({
      next: (response: any) => {
        const idLqui = response.idLiqui;
        if (!idLqui) {
          console.error("Liquidación ID no encontrado en la respuesta", response);
          return;
        }
        Swal.fire({
          title: 'Liquidación creada con éxito',
          text: '¿Desea descargar el documento de liquidación?',
          icon: 'success',
          showCancelButton: true,
          confirmButtonText: 'Sí, descargar',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            this.liquidacionService.downloadLiquidacion(
              idLqui,
              this.liquidacion.usuContr,
              this.tipoObjTribDesc
            ).subscribe((blob: Blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'liquidacion.pdf';
              a.click();
              window.URL.revokeObjectURL(url);
            });
          }
        });
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire('Error al crear liquidación', error.error.message, 'error').then(r => r);
        console.error("[LiquidacionFormComponent] Error en onSubmit:", error);
      }
    });
  }
}
