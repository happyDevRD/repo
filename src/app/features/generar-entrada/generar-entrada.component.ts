import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TemaDocumentoDTO } from '../../core/models/documento/tema-documento.dto';
import { EntradaService } from 'src/app/core/service/entrada.service';
import { TemaDocumentoService } from '../../core/service/documento/tema-documento.service';
import { ContabilidadService } from '../../core/service/contabilidad/contabilidad.service';
import { UserSessionService } from '../../core/service/user-session.service';
import { NotificationService } from '../../core/service/notification.service';
import { fechaHoyISO } from '../../core/helper/fecha-legacy.helper';

interface Contabilidad {
  idConta: number;
  rotConta: string;
}

@Component({
  selector: 'app-generar-entrada',
  templateUrl: './generar-entrada.component.html',
  styleUrls: ['./generar-entrada.component.css'],
})
export class GenerarEntradaComponent implements OnInit {
  // Entradas y Salidas del componente
  @Input() verExpediente: any;
  @Input() numeroArchivo!: number;
  @Input() idTarea!: number;
  @Input() idExped!: number;
  @Output() modalClosed = new EventEmitter<void>();

  // Referencia al formulario del HTML
  @ViewChild('entradaForm') entradaForm!: NgForm;

  // Propiedades del componente
  public fechaHoy: string = fechaHoyISO();
  public tipoIVA: number = 0.00;
  public currencyOptions = {
    align: 'right',
    allowNegative: false,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: ' €',
    thousands: '.',
  };

  public entrada: EntradaDTO = new EntradaDTO();
  public registrarFactura: boolean = false;
  public factura: FacturaDTO = new FacturaDTO();

  public contabilidades: Contabilidad[] = [];
  public loading: boolean = false;
  public error: string | null = null;

  public temasDocumentoListar: TemaDocumentoDTO[] = [];
  public selectedTema: TemaDocumentoDTO | null = null;

  constructor(
    private entradaService: EntradaService,
    private temaDocumentoService: TemaDocumentoService,
    private contabilidadService: ContabilidadService,
    private session: UserSessionService,
    private notificationService: NotificationService
  ) {
    this.resetFactura(); // Inicializa la factura
  }

  get usuario(): string | null {
    return this.session.user;
  }

  ngOnInit(): void {
    this.cargarTemasDocumento();
  }

  onRegistrarFacturaChange(): void {
    if (this.registrarFactura && this.contabilidades.length === 0) {
      this.cargarContabilidades();
    }
  }


  cargarContabilidades(): void {
    this.loading = true;
    this.contabilidadService.getContabilidades().subscribe({
      next: (contabilidades) => {
        this.contabilidades = contabilidades;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar las contabilidades:', error);
        this.error = error;
        this.loading = false;
        this.showErrorAlert('No se pudieron cargar los datos de contabilidad.');
      },
    });
  }

  cargarTemasDocumento(): void {
    this.temaDocumentoService.getTemaDocumentoListar().subscribe({
      next: (temas) => {
        this.temasDocumentoListar = temas;
      },
      error: (error) => {
        console.error('Error al cargar los temas de documento:', error);
        this.showErrorAlert('No se pudieron cargar los temas de documento.');
      },
    });
  }

  onTemaSelected(): void {
    this.entrada.codTema = this.selectedTema ? this.selectedTema.codTema : null;
  }

  onSubmit(): void {
    if (this.entradaForm.invalid) {
      this.showWarning('Por favor, complete todos los campos obligatorios (*).');
      return;
    }

    this.notificationService.custom({
      title: 'Procesando...',
      text: 'Generando registro de entrada.',
      allowOutsideClick: false,
      didOpen: () => this.notificationService.showLoading(),
    });

    const entradaData = {
      ...this.entrada,
      ejeExped: this.verExpediente?.ejercicio,
      numExped: this.verExpediente?.numero,
      usuContr: this.usuario,
    };

    const paramsEntrada = {
      idPerso: this.verExpediente?.personaEntidad?.idPerso,
      idHisPerso: this.verExpediente?.personaEntidad?.idHisPerso,
      codArchi: this.numeroArchivo,
      idTarea: this.idTarea,
    };

    this.entradaService.crearEntrada(entradaData, paramsEntrada).subscribe({
      next: (response) => {
        if (this.registrarFactura) {
          this.handleFactura(response);
        } else {
          this.notificationService.close();
          this.showSuccess(`Registro de entrada generado: ${response}`);
          this.closeModal();
        }
      },
      error: (err) => {
        this.notificationService.close();
        this.handleError(err, 'Error al crear la entrada.');
      },
    });
  }

  private handleFactura(identificadorGenerarEntrada: any): void {
    const partesIdentificador = identificadorGenerarEntrada.split('/');
    const ejeRegis = parseInt(partesIdentificador[0], 10);
    const numRegis = parseInt(partesIdentificador[1], 10);

    const facturaData = {
      ...this.factura,
      ejeRegis: ejeRegis,
      numRegis: numRegis,
      indIvaDeduc: this.factura.indIvaDeduc ? 1 : 0,
    };

    this.entradaService.crearJustificanteGasto(facturaData, this.idExped).subscribe({
      next: () => {
        this.notificationService.close();
        this.showSuccess(`¡Éxito! Entrada ${identificadorGenerarEntrada} y factura creadas.`);
        this.closeModal();
      },
      error: (err) => {
        this.notificationService.close();
        this.handleError(err, 'La entrada se creó, pero falló la creación de la factura.');
      },
    });
  }

  private handleError(err: any, customMessage?: string): void {
    console.error('Error:', err);
    const errorMessage = customMessage || err.error?.message || 'Ocurrió un error inesperado.';
    this.showErrorAlert(errorMessage);
  }

  private showErrorAlert(message: string): void {
    this.notificationService.error({
      title: 'Error',
      text: message,
    });
  }

  private showSuccess(message: string): void {
    this.notificationService.success({
      title: 'Operación Exitosa',
      text: message,
      confirmButtonText: 'Aceptar',
    });
  }

  private showWarning(message: string): void {
    this.notificationService.warning({
      title: 'Atención',
      text: message,
    });
  }

  calcularImportes(): void {
    const total = this.factura.impTotal || 0;
    const descuento = this.factura.impDto || 0;
    const baseImponible = total - descuento;
    const ivaCalculado = baseImponible * this.tipoIVA;
    const liquido = baseImponible + ivaCalculado;

    this.factura.impIva = parseFloat(ivaCalculado.toFixed(2));
    this.factura.impLiqui = parseFloat(liquido.toFixed(2));
  }

  private resetEntrada(): void {
    this.entrada = new EntradaDTO();
    this.selectedTema = null;
  }

  private resetFactura(): void {
    this.factura = new FacturaDTO();
    this.factura.fecJusExter = this.fechaHoy;
    this.tipoIVA = 0.00;
  }

  public closeModal(): void {
    this.resetEntrada();
    this.resetFactura();
    this.registrarFactura = false;
    // Emite el evento para que el componente padre cierre el modal
    this.modalClosed.emit();
  }
}

// Clases DTO para asegurar la inicialización correcta
export class EntradaDTO {
  descripcion: string = '';
  codTema: string | null = null;
  extracto: string = '';
  observaciones: string = '';
}

export class FacturaDTO {
  idConta: number | null = null;
  fecJusExter: string = '';
  numJusExter: string = '';
  indTipDocum: number | null = null;
  txtJusGasto: string = '';
  indArea: number | null = null;
  indIvaDeduc: number | boolean = 0;
  impTotal: number = 0;
  impDto: number = 0;
  impIva: number = 0;
  impLiqui: number = 0;
}
