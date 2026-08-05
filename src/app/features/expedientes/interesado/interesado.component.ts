import { Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpedientesService } from '../expedientes.service';
import { ProcedimientoService } from 'src/app/features/procedimientos/procedimiento.service';
import { ConsultaDni, CrearInteresado, RepresentanteExpLIstar, VerExpediente } from '../expedientes';
import { InteresadoListarDto } from '../../../core/models/interesado.dto';
import { NotificationService } from '../../../core/service/notification.service';
import { FormValidatorHelper } from '../../../core/helper/form-validator.helper';
import { ModalManagerService } from '../../../core/service/modal-manager.service';
import { UserSessionService } from '../../../core/service/user-session.service';
import { fechaHoyISO } from '../../../core/helper/fecha-legacy.helper';



@Component({
  selector: 'app-interesado',
  templateUrl: './interesado.component.html',
  styleUrls: ['./interesado.component.css']
})
export class InteresadoComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef)
  public title = 'Expedientes';
  public relleno: string = 'Datos de prueba';
  public verexpediente: any = new VerExpediente();
  public crearinteresado: CrearInteresado = new CrearInteresado();
  public representanteexplistar: RepresentanteExpLIstar = new RepresentanteExpLIstar();
  public consultadni: ConsultaDni = new ConsultaDni();
  /** Cuando se usa embebido como modal, el id llega por Input en vez de por la ruta. */
  @Input() idExpediente!: number;
  /** true cuando este componente se monta como modal (p.ej. desde el listado de expedientes)
   *  en vez de como página propia en la ruta /interesado/interesado/:id. */
  @Input() modal = false;
  public selected = new Date();
  public formanotificacion: boolean = false
  public dniok: boolean = false






  public nombredni!: string
  public apellido1dni!: any
  public apellido2dni!: any
  public direcciondni!: string
  public cpdni!: any
  public provinciadni!: any
  public nommunicipiodni!: any
  public idhispersodni!: any;
  public idpersodni!: any;


  public solicitadni(dni: string) {
    this.formanotificacion = true;
    this.expedientesService.getDni2(dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(response => {
      this.nombredni = response.desPerEntid;
      this.apellido1dni = response.apellido1;
      this.apellido2dni = response.apellido2;
      this.direcciondni = response.dirPosta;
      this.cpdni = response.codPosta;
      this.provinciadni = response.provincia;
      this.idhispersodni = response.idHisPerso;
      this.idpersodni = response.idPerso;
      this.nommunicipiodni = response.municipio;


      // consultadni =>this.consultadni = consultadni
      if (response.nombre) {
        this.getrepresentanteexpediente(response.idPerso, response.idHisPerso);

      }

    }



    );


    this.dniok = true;


    //setTimeout(this.getrepresentanteexpediente,1500)
    // this.getrepresentanteexpediente ();




  }


  public veorepresentante: boolean = false;

  getrepresentanteexpediente(idperso: any, idhisperso: any) {
    this.veorepresentante = true;

    this.expedientesService.getRepresentanteExpediente(idperso, idhisperso).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(


      representanteexplistar => this.representanteexplistar = representanteexplistar,
      (err: HttpErrorResponse) => {
        this.representanteexplistar.desPerEntid = "Sin representante asociado"

        this.representanteexplistar = new RepresentanteExpLIstar();
        this.crearinteresado.idHisRepre = null;
        this.crearinteresado.idPersoRepre = null;



        // swal.fire(err.error.message,'','warning' )    // AQUI GESTIONAMOS EL ERROR
      },




    );





  }


  public limpiadatosinteresado() {
    this.dniok = false;
    this.veorepresentante = false;
    this.crearinteresado = new CrearInteresado();
    this.crearinteresado.fechaInicio = fechaHoyISO();
    this.crearinteresado.tipForNotif = null as unknown as number;
    this.crearinteresado.email = '';
    this.seleccionoRepre = false;
    this.idhispersodni = "";
    this.idpersodni = "";
    this.nombredni = "";
    this.direcciondni = "";
    this.cpdni = "";
    this.provinciadni = "";
    this.nommunicipiodni = "";
    this.representanteexplistar = new RepresentanteExpLIstar();

    // Limpiar errores visuales
    FormValidatorHelper.clearFieldErrors();
  }
  public seleccionoRepre!: any;

  public handleFormaNotificacionChange(tipForNotif: number | null): void {
    if (tipForNotif !== 1) {
      this.crearinteresado.email = '';
    }
  }

  /**
   * Valida un campo individual cuando el usuario lo completa
   */
  public validateField(fieldName: string, value: any): void {
    if (value && value.toString().trim() !== '') {
      FormValidatorHelper.markFieldAsValid(fieldName);
    } else {
      FormValidatorHelper.markFieldAsError(fieldName);
    }
  }

  public crearInteresado() {
    // Validar campos obligatorios (tipForNotif=0 es válido: correo postal)
    const requiredFields = ['interesado'];
    const formData = {
      interesado: this.crearinteresado.usuario,
    };

    if (!FormValidatorHelper.validateFields(formData, requiredFields, this.notificationService)) {
      return;
    }

    if (this.crearinteresado.tipForNotif !== 0 && this.crearinteresado.tipForNotif !== 1) {
      FormValidatorHelper.markFieldAsError('fnotifi');
      this.notificationService.incompleteFields();
      return;
    }

    // Validar email si es notificación telemática
    if (this.crearinteresado.tipForNotif == 1 && this.crearinteresado.email) {
      if (!FormValidatorHelper.validateEmail(this.crearinteresado.email, this.notificationService)) {
        return;
      }
    }

    // Validar que se haya consultado el DNI
    if (!this.dniok) {
      this.notificationService.warning('Debe consultar el DNI del interesado antes de guardar.');
      return;
    }

    this.crearinteresado.idHisPerso = this.idhispersodni;
    this.crearinteresado.idPerso = this.idpersodni;
    this.crearinteresado.idexpediente = this.idExpediente;

    if (this.seleccionoRepre == "1" || this.seleccionoRepre === true) {
      this.crearinteresado.idHisRepre = this.representanteexplistar.idHisPerso;
      this.crearinteresado.idPersoRepre = this.representanteexplistar.idPerso;
    }
    this.expedientesService.crearInteresado(this.crearinteresado).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: () => {
        this.cargarInteresados();
        this.notificationService.saveSuccess('Interesado')
        this.cerrarModal('ninteresadoModal')
      },
      error: (error: HttpErrorResponse) => {
        this.notificationService.fromHttpError(error, 'No se pudo crear el interesado')
        if (error.status === 403) {
          this.limpiadatosinteresado()
        }
      },
    })
  }

  public borrarinteresados() {
    this.notificationService.confirmDelete(`interesado: ${this.nombreinteresado}`).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.deleteInteresado(this.idInteresado).pipe(
          takeUntilDestroyed(this.destroyRef),
        ).subscribe({
          next: () => {
            this.notificationService.deleteSuccess('Interesado');
            this.veoBorraInteresado = false;
            this.cargarInteresados();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.notificationService.error('No se ha podido borrar el elemento. Existen elementos dependientes asociados.');
            } else {
              this.notificationService.error('Error al eliminar el interesado.');
            }
          },
        });
      }
    })
  }



  // *************** gestión del GRID de INTERESADOS    ****************
  public veoBorraInteresado: boolean = false;
  public idInteresado!: any;
  public nombreinteresado: string;
  public numDocumInter: string;
  public principal: string;
  public nomRepre: string;
  public numDocumRepre: string;
  public forNotif: string;
  public dirInter: string;
  public dirRepre: string;
  public desProviInter: string;
  public desProviRepre: string;
  public desMunicInter: string;
  public desMunicRepre: string;
  public emailNotif: string;
  public veoprincipal: boolean = false;
  public veoemail: boolean = false;



  public seleccionarInteresado(rowData: InteresadoListarDto): void {
    this.veoBorraInteresado = true
    this.emailNotif = rowData.emailNotif
    this.numDocumInter = rowData.numDocumInter
    this.principal = String(rowData.principal)
    this.nomRepre = rowData.nomRepre ?? ''
    this.numDocumRepre = rowData.numDocumRepre ?? ''
    this.forNotif = rowData.forNotif
    this.dirInter = rowData.dirInter
    this.dirRepre = rowData.dirRepre ?? ''
    this.desProviInter = rowData.desProviInter
    this.desProviRepre = rowData.desProviRepre ?? ''
    this.desMunicInter = rowData.desMunicInter
    this.desMunicRepre = rowData.desMunicRepre ?? ''
    this.nombreinteresado = rowData.nomInter
    this.idInteresado = rowData.id

    this.veoprincipal = rowData.principal == 1
    this.veoemail = rowData.forNotif == 'TELEMÁTICO'
  }

  /** Clic simple: selecciona (habilita borrar). Doble clic: abre el detalle de solo lectura. */
  public clickInteresado(rowData: InteresadoListarDto): void {
    this.seleccionarInteresado(rowData)
  }

  public abrirModalVerInteresado(rowData: InteresadoListarDto): void {
    this.seleccionarInteresado(rowData)
    this.abrirModal('verInteresadoModal')
  }


  public interesados: InteresadoListarDto[] = [];
  public cargandoInteresados: boolean = false;

  public cargarInteresados(): void {
    if (!this.idExpediente) {
      return;
    }
    this.cargandoInteresados = true;
    this.expedientesService.getInteresadoListarDto(this.idExpediente).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (interesados) => {
        this.interesados = interesados ?? [];
        this.cargandoInteresados = false;
      },
      error: () => {
        this.interesados = [];
        this.cargandoInteresados = false;
      },
    });
  }

  async cargarexpediente() {
    this.activatedRoute.params.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(params => {
      const id = params['id'];
      this.cargarPorId(id);
    })
  }

  /** Núcleo de carga (interesados + datos del expediente), reutilizado tanto
   *  por la ruta propia (id vía params) como por el uso embebido como modal (id vía Input). */
  cargarPorId(id: number): void {
    this.idExpediente = id;
    this.cargarInteresados();

    if (id) {
      this.expedientesService.getExpediente(id).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe(
        (verexpediente) => this.verexpediente = verexpediente
      );
    }
  }






  constructor(
    public expedientesService: ExpedientesService,
    public procedimientoService: ProcedimientoService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private modalManagerService: ModalManagerService,
    public session: UserSessionService
  ) { };

  // Gestión de modales
  public abrirModal(modalId: string): void {
    if (modalId === 'ninteresadoModal') {
      this.limpiadatosinteresado();
    }
    this.modalManagerService.openModal(modalId);
  }

  public cerrarModal(modalId: string): void {
    // Resetear datos específicos según el modal
    if (modalId === 'ninteresadoModal') {
      this.limpiadatosinteresado();
    }

    this.modalManagerService.closeModal(modalId);
  }

  ngOnInit() {
    if (this.modal) {
      this.cargarPorId(this.idExpediente);
      return;
    }
    this.cargarexpediente();
  }



}
