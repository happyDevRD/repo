import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ContabilidadService } from '../../core/service/contabilidad/contabilidad.service';
import { OperacionService } from '../../core/service/operacion/operacion.service';
import { ContabilidadDTO } from '../../core/models/contabilidad/contabilidad.dto';
import { Operacion } from '../../core/models/operacion.model';
import { Subject, of, combineLatest } from 'rxjs';
import { takeUntil, switchMap, catchError, startWith } from 'rxjs/operators';
import { UserSessionService } from '../../core/service/user-session.service';
import { reconcileModalDomState } from '../../core/service/modal-dom.util';
import { NotificationService } from '../../core/service/notification.service';

@Component({
  selector: 'app-operacion-form',
  templateUrl: './operacion-form.component.html',
  styleUrls: ['./operacion-form.component.css'],
})
export class OperacionFormComponent implements OnInit, OnDestroy {
  @Input() idExpediente: number;
  @Output() closeModal = new EventEmitter<void>();

  opcionesAgrupacionAreaSeleccionada: any[] = [];
  operacionForm: FormGroup;
  rotContaOptions: ContabilidadDTO[] = [];

  areaOptions = [
    { valor: '1', nombre: 'Ingresos' },
    { valor: '2', nombre: 'Gastos' },
    { valor: '3', nombre: 'No Presupuestaria' },
    { valor: '4', nombre: 'Recursos Otros Entes' },
    { valor: '5', nombre: 'Agentes Recaudadores' },
  ];

  agrupacionOptions: { [key: string]: any[] } = {
    '1': [
      { valor: '1', nombre: 'Corriente' },
      { valor: '2', nombre: 'Cerrados' },
      { valor: '10', nombre: 'Ej. Posteriores' },
    ],
    '2': [
      { valor: '1', nombre: 'Corriente' },
      { valor: '2', nombre: 'Cerrados' },
      { valor: '10', nombre: 'Ej. Posteriores' },
    ],
    '3': [
      { valor: '0', nombre: 'Deudores/Acreedores/Pdte.Aplic.' },
      { valor: '10', nombre: 'Arqueos Contables' },
      { valor: '30', nombre: 'Movim. Internos Tesor.' },
      { valor: '70', nombre: 'Valores' },
      { valor: '99', nombre: 'Op. Internas (IVA/IGIC)' },
    ],
    '4': [
      { valor: '0', nombre: 'Rec. Otros Entes' },
      { valor: '10', nombre: 'Sit. Entes' },
    ],
    '5': [
      { valor: '10', nombre: 'Recibos' },
      { valor: '20', nombre: 'Cert. Desc.' },
    ],
  };

  signoOptions = [
    { valor: '0', nombre: 'Positivo' },
    { valor: '1', nombre: 'Negativo' },
  ];

  // Opciones de IVA: valor vacío para "Sin IVA" y luego porcentajes
  tipoIvaOptions = ['', '4', '10', '21'];

  idCodOpera: string | number | null = null;
  private unsubscribe$ = new Subject<void>();

  // Configuración para ngx-currency (formato para euros)
  public currencyOptions = {
    align: 'right',
    allowNegative: false,
    decimal: ',',
    precision: 2,
    prefix: '',
    suffix: ' €',
    thousands: '.'
  };

  get usuario(): string | null {
    return this.session.user;
  }

  constructor(
    private fb: FormBuilder,
    private contabilidadService: ContabilidadService,
    private operacionService: OperacionService,
    private session: UserSessionService,
    private notificationService: NotificationService
  ) {
    this.operacionForm = this.fb.group({
      idConta: ['', Validators.required],
      indTipDocum: [''],
      numJusExter: [''],
      fecJusExter: [''],
      txtJusGasto: [''],
      indIvaDeduc: [''],
      indArea: ['', Validators.required],
      impTotal: [0, Validators.required],
      impDto: [0],
      impIva: [{ value: 0, disabled: true }],
      impLiqui: [{ value: 0, disabled: true }],
      ejeRegis: [''],
      numRegis: [''],
      usuContr: [''],
      indAgrup: ['', Validators.required],
      claOpera: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]{3}$/),
        ],
      ],
      signo: ['', Validators.required],
      fecOpera: ['', Validators.required],
      txtOpera: ['', [ Validators.maxLength(200)]],
      tipoIva: [''],
      observaciones: ['', Validators.maxLength(200)],
    });
  }

  ngOnInit(): void {
    this.cargarRotContaOptions();

    // Usamos combineLatest con startWith para emitir los valores iniciales
    combineLatest([
      this.operacionForm.get('impTotal')!.valueChanges.pipe(
        startWith(this.operacionForm.get('impTotal')?.value)
      ),
      this.operacionForm.get('impDto')!.valueChanges.pipe(
        startWith(this.operacionForm.get('impDto')?.value)
      ),
      this.operacionForm.get('tipoIva')!.valueChanges.pipe(
        startWith(this.operacionForm.get('tipoIva')?.value)
      )
    ])
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.calcularImporteIvaLiquido();
      });

    // Suscribirse a cambios del área para actualizar la agrupación
    this.operacionForm.get('indArea')?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(() => {
        this.onAreaChange();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    reconcileModalDomState();
  }

  cargarRotContaOptions() {
    this.contabilidadService
      .getContabilidades()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (contabilidades) => {
          this.rotContaOptions = contabilidades;
        },
        error: () => {
          this.rotContaOptions = [];
        },
      });
  }

  onAreaChange() {
    const areaSeleccionada = this.operacionForm.get('indArea')?.value;
    this.opcionesAgrupacionAreaSeleccionada =
      this.agrupacionOptions[areaSeleccionada] || [];
    this.operacionForm.get('indAgrup')?.setValue(null);
  }

  calcularImporteIvaLiquido() {
    const { impTotal, impDto, tipoIva } = this.operacionForm.value;
    const total = parseFloat(impTotal) || 0;
    const dto = parseFloat(impDto) || 0;

    if (tipoIva === '') {
      // Caso sin IVA
      this.operacionForm.patchValue({
        impIva: 0,
        impLiqui: total - dto,
      });
    } else {
      // Calcular IVA y el importe líquido
      const ivaPorcentaje = parseFloat(tipoIva) || 0;
      const impIva = (total * ivaPorcentaje) / 100;
      const impLiqui = total - dto + impIva;
      this.operacionForm.patchValue({ impIva, impLiqui });
    }
  }

  calcularIdCodOpera(): void {
    this.operacionForm.markAllAsTouched();

    if (
      this.operacionForm.get('idConta')?.valid &&
      this.operacionForm.get('indArea')?.valid &&
      this.operacionForm.get('indAgrup')?.valid &&
      this.operacionForm.get('claOpera')?.valid &&
      this.operacionForm.get('signo')?.valid
    ) {
      const idConta = this.operacionForm.get('idConta')?.value;
      const indArea = this.operacionForm.get('indArea')?.value;
      const indAgrup = this.operacionForm.get('indAgrup')?.value;
      const claOpera = this.operacionForm.get('claOpera')?.value;
      const signo = this.operacionForm.get('signo')?.value;
      const numericArea = parseInt(indArea);
      const numericAgrup = parseInt(indAgrup);

      this.operacionService
        .obtenerIdCodOpera(idConta, numericArea, numericAgrup, signo, claOpera)
        .pipe(
          takeUntil(this.unsubscribe$),
          catchError((error) => {
            console.error('Error al calcular ID Código Operación (manual):', error);
            this.idCodOpera = null;
            let errorMessage = 'No se pudo calcular el Código de Operación.';
            if (error.status === 404) {
              errorMessage =
                'El Código de Operación no existe para los valores seleccionados.';
            } else if (error.status === 400) {
              errorMessage = 'Error en la solicitud. Por favor, revise los datos.';
            }
            this.notificationService.error({
              title: 'Error al calcular Código Operación',
              text: errorMessage,
            }).then(r => r);
            return of(null);
          })
        )
        .subscribe((idCodOpera) => {
          this.idCodOpera = idCodOpera;
          if (idCodOpera) {
            this.notificationService.success({
              title: 'Código de Operación Obtenido',
              text: `El código de operación es: ${idCodOpera}`,
            });
          }
        });
    } else {
      this.notificationService.warning({
        title: 'Datos incompletos',
        text: 'Por favor, rellena todos los campos del código de operación para validarlo.',
      }).then(r => r);
    }
  }

  guardarOperacion() {
    if (this.operacionForm.invalid) {
      this.logFormErrors(this.operacionForm);
      this.operacionForm.markAllAsTouched();
      return;
    }

    const idConta = this.operacionForm.get('idConta')?.value;
    const indArea = this.operacionForm.get('indArea')?.value;
    const indAgrup = this.operacionForm.get('indAgrup')?.value;
    const claOpera = this.operacionForm.get('claOpera')?.value;
    const signo = this.operacionForm.get('signo')?.value;

    if (!idConta || !indArea || !indAgrup || !claOpera || !signo) {
      this.notificationService.warning({
        title: 'Datos incompletos',
        text:
          'Por favor, rellena todos los campos necesarios para calcular el Código de Operación.',
      }).then(r => r);
      return;
    }

    const numericArea = parseInt(indArea);
    const numericAgrup = parseInt(indAgrup);

    this.operacionService
      .obtenerIdCodOpera(idConta, numericArea, numericAgrup, signo, claOpera)
      .pipe(
        switchMap((idCodOpera) => {
          if (!idCodOpera) {
            this.notificationService.error({
              title: 'Error',
              text: 'No se pudo calcular el Código de Operación. Verifica los datos.',
            }).then(r => r);
            return of(null);
          }
          this.idCodOpera = idCodOpera;

          const fecOperaValue = this.operacionForm.get('fecOpera')?.value;
          const fecOperaISO = fecOperaValue
            ? new Date(fecOperaValue).toISOString()
            : null;
          const operacion: Operacion = {
            idConta     : idConta,
            fecOpera    : fecOperaISO,
            idCodOpera  : idCodOpera,
            txtOpera    : this.operacionForm.get('txtOpera')?.value,
            impTotal    : parseFloat(this.operacionForm.get('impTotal')?.value),
            impDto      : parseFloat(this.operacionForm.get('impDto')?.value ?? 0),
            impIva      : parseFloat(this.operacionForm.get('impIva')?.value),
            impLiqui    : parseFloat(this.operacionForm.get('impLiqui')?.value),
            observaciones: this.operacionForm.get('observaciones')?.value,
            usuario     : this.usuario,
            indTipDocum : this.operacionForm.get('indTipDocum')?.value,
            numJusExter : this.operacionForm.get('numJusExter')?.value,
            fecJusExter : this.operacionForm.get('fecJusExter')?.value,
            txtJusGasto : this.operacionForm.get('txtJusGasto')?.value,
            indIvaDeduc : this.operacionForm.get('indIvaDeduc')?.value,
            indArea     : indArea,
            ejeRegis    : this.operacionForm.get('ejeRegis')?.value,
            numRegis    : this.operacionForm.get('numRegis')?.value,
            usuContr    : this.operacionForm.get('usuContr')?.value,
            indAgrup    : indAgrup,
            claOpera    : claOpera,
            signo       : signo,
            tipoIva     : this.operacionForm.get('tipoIva')?.value,
          };

          return this.operacionService.crearOperacion(operacion, this.idExpediente);
        }),
        catchError((error) => {
          console.error('Error al calcular ID Código Operación o crear la operación:', error);
          this.notificationService.error({
            title: 'Error',
            text:
              'Ha ocurrido un error al procesar la operación. Por favor, inténtalo de nuevo.',
          }).then(r => r);
          return of(null);
        })
      )
      .subscribe((result) => {
        if (result) {
          this.notificationService.success({
            title: 'Operación Creada',
            text: 'La operación se ha creado correctamente.',
          }).then(r => r);
          // Reiniciar formulario y variables
          this.operacionForm.reset();
          this.idCodOpera = null;
          this.opcionesAgrupacionAreaSeleccionada = [];
          // Reestablecer el tipo IVA a "Sin IVA"
          this.operacionForm.get('tipoIva')?.setValue('');
        }
      });
  }

  handleCloseModal(): void {
    this.closeModal.emit()
  }

  private logFormErrors(control: AbstractControl): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach((key: string) => {
        const child = control.get(key);
        if (child && child.invalid) {
          console.error(`Control ${key} inválido:`, child.errors);
        }
        if (child) {
          this.logFormErrors(child);
        }
      });
    }
  }
}
