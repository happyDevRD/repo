import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { ConsultaDni, CrearPersonaEntidad, RepresentanteExpLIstar } from '../../expedientes/expedientes';
import { CreaSolicitudNuevo, EditarSolicitud } from '../solicitudes';
import { ExpedientesService } from '../../expedientes/expedientes.service';
import { NotificationService } from '../../core/service/notification.service';
import { SolicitudesGridFacade, SolicitudesGridHost } from './solicitudes-grid.facade';
import { MUNICIO } from 'src/app/core/constants/datos';

export interface SolicitudesPersonaHost extends SolicitudesGridHost {
  creasolicitud: CreaSolicitudNuevo;
  editasolicitud: EditarSolicitud;
  representanteexplistar: RepresentanteExpLIstar;
  crearpersonaentidad: CrearPersonaEntidad;
}

/**
 * Encapsula la consulta de DNI/persona/representante que antes vivía
 * directamente en SolicitudesComponent (soliciUsuario*, getrepresentanteexpediente,
 * crearPersonaEntidad), junto con las banderas y datos del wizard de "Nueva Solicitud"
 * (selecTipPerso, gestimunicip, cambiamosRepre, etc.).
 */
@Injectable()
export class SolicitudesPersonaFacade {
  private readonly destroyRef = inject(DestroyRef);

  public nombredni: string;
  public apellido1dni: any;
  public apellido2dni: any;
  public direcciondni: string;
  public cpdni: any;
  public provinciadni: any;
  public idhispersodni: any;
  public idpersodni: any;
  public nommunicipiodni: any;

  public dniok = false;
  public existepersonaentidad = false;
  public existeRepresentante = false;
  public representanteok = false;
  public vernumerorepre = false;
  public cambioRepresentante = false;
  public cambioRepresentantePideDocu = false;
  public documrepre = false;
  public controlpersonaentidadcrear = false;

  public InteresadoSolicitud: any;
  public dirPosta: string;
  public codPosta: string;
  public provincia: string;
  public Municipio: string;
  public representanteSolicitud = '';

  public consultadni: ConsultaDni = new ConsultaDni();

  public selectnombre = false;
  public selectape1 = false;
  public selectape2 = false;
  public selectRazonSocial = false;
  public selectCIF = false;
  public selectTRESIDENTE = false;

  public municiflitro: any[] = [];

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly notificationService: NotificationService,
    private readonly gridFacade: SolicitudesGridFacade,
  ) {}

  consultarInteresado(host: SolicitudesPersonaHost, dni: string): void {
    try {
      this.expedientesService.getDni2(dni).pipe(
        takeUntilDestroyed(this.destroyRef),
      ).subscribe({
        next: (response) => {
          this.asignarDatosDni(response);

          host.creasolicitud.idPerso = response.idPerso;
          host.creasolicitud.idHisPerso = response.idHisPerso;

          this.gridFacade.refreshRepresentantesList(
            host,
            host.creasolicitud.idPerso,
            host.creasolicitud.idHisPerso,
            true,
          );

          if (response.nombre) {
            this.dniok = true;
            this.InteresadoSolicitud = response.desPerEntid;
            this.dirPosta = response.dirPosta;
            this.codPosta = response.codPosta.toString();
            this.provincia = response.provincia;
            this.Municipio = response.municipio;
            host.editasolicitud.idPerso = response.idPerso;
            host.editasolicitud.idHisPerso = response.idHisPerso;
            this.controlpersonaentidadcrear = true;
          } else {
            this.dniok = false;
            this.existepersonaentidad = true;
            this.controlpersonaentidadcrear = false;
          }
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 404) {
            this.notificationService.error(
              'El interesado no está registrado. Por favor introduzca los datos para el alta.',
            );
            this.existepersonaentidad = true;
            this.dniok = false;
          } else {
            this.existepersonaentidad = false;
          }
        },
      });
    } catch (error) {
      this.gridFacade.refreshRepresentantesList(host, host.creasolicitud.idPerso, host.creasolicitud.idHisPerso);
    }
  }

  consultarRepresentante(host: SolicitudesPersonaHost, dni: string): void {
    this.expedientesService.getDni2(dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.asignarDatosDni(response);

        host.creasolicitud.idRepre = response.idPerso;
        host.creasolicitud.idHisRepre = response.idHisPerso;

        if (response.nombre) {
          this.dniok = false;
          this.representanteok = true;
          this.existeRepresentante = false;
          this.vernumerorepre = true;
          this.cambioRepresentantePideDocu = false;

          this.InteresadoSolicitud = response.desPerEntid;
          this.dirPosta = response.dirPosta;
          this.codPosta = response.codPosta.toString();
          this.provincia = response.provincia;
          this.Municipio = response.municipio;
          host.editasolicitud.idPerso = response.idPerso;
          host.editasolicitud.idHisPerso = response.idHisPerso;
          this.controlpersonaentidadcrear = true;
        } else {
          this.existeRepresentante = true;
          this.representanteok = false;
          this.dniok = false;
          this.existepersonaentidad = true;
          this.controlpersonaentidadcrear = false;
          this.documrepre = true;
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) {
          this.notificationService.error({ title: 'El Representante no está registrado', text: 'Por favor introduzca los datos para el alta' });
          this.existeRepresentante = true;
          this.dniok = false;
          this.representanteok = false;
        } else {
          this.existeRepresentante = false;
          this.representanteok = true;
        }
      },
    });
  }

  consultarRepresentanteExpediente(host: SolicitudesPersonaHost, idPerso: number, idHisPerso: number): void {
    this.expedientesService.getRepresentanteExpediente(idPerso, idHisPerso).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        if (response.idPerso) {
          host.representanteexplistar.idPerso = response.idPerso;
          host.editasolicitud.idRepre = response.idPerso;
          host.editasolicitud.idHisRepre = response.idHisPerso;
          host.representanteexplistar.idHisPerso = response.idHisPerso;
          host.representanteexplistar.numDocum = response.numDocum;
          host.representanteexplistar.tipPerso = response.tipPerso;
          host.representanteexplistar.nombre = response.nombre;
          host.representanteexplistar.particula1 = response.particula1;
          host.representanteexplistar.apellido1 = response.apellido1;
          host.representanteexplistar.particula2 = response.particula2;
          host.representanteexplistar.apellido2 = response.apellido2;
          host.representanteexplistar.razSocia = response.razSocia;
          host.representanteexplistar.razSocReduc = response.razSocReduc;
          host.representanteexplistar.desPerEntid = response.desPerEntid;
          host.representanteexplistar.localidad = response.localidad;
          host.representanteexplistar.codPosta = response.codPosta;
          host.representanteexplistar.dirPosta = response.dirPosta;
          host.representanteexplistar.municipio = response.municipio;
          host.representanteexplistar.provincia = response.provincia;
          this.representanteSolicitud = response.desPerEntid;
        } else {
          host.representanteexplistar = new RepresentanteExpLIstar();
        }
      },
      error: (error: HttpErrorResponse) => {
        if (error.status == 404) {
          host.representanteexplistar = new RepresentanteExpLIstar();
          host.creasolicitud.idHisRepre = null;
          host.creasolicitud.idRepre = null;
          host.editasolicitud.idHisRepre = null;
          host.editasolicitud.idRepre = null;
        }
      },
    });

    this.representanteSolicitud = '';
  }

  crearPersonaEntidad(host: SolicitudesPersonaHost, dni: string): void {
    const datos = host.crearpersonaentidad;
    const tieneDatos = datos.nombre || datos.apellido1 || datos.apellido2 || datos.dirPosta || datos.municipio || datos.provincia;

    if (!tieneDatos) {
      this.controlpersonaentidadcrear = false;
      this.notificationService.incompleteFields('Por favor, complete todos los campos obligatorios del interesado.');
      return;
    }

    this.controlpersonaentidadcrear = true;
    this.expedientesService.crearPersonaEntidad(datos, dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.controlpersonaentidadcrear = true;
    });
  }

  /**
   * Selección del tipo de documento en el wizard de "Nueva Solicitud"
   * (antes selecTipPerso en el componente).
   */
  selecTipPerso(valor: any): void {
    switch (valor) {
      case '1':
        this.selectnombre = true;
        this.selectape1 = true;
        this.selectape2 = true;
        this.selectRazonSocial = false;
        break;
      case '2':
        this.selectnombre = false;
        this.selectape1 = false;
        this.selectape2 = false;
        this.selectRazonSocial = true;
        break;
      case '3':
        this.selectnombre = true;
        this.selectape1 = true;
        this.selectape2 = false;
        this.selectRazonSocial = false;
        break;
    }
  }

  /**
   * Filtra los municipios de la provincia seleccionada (antes gestimunicip en el componente).
   */
  gestimunicip(id: any): void {
    this.municiflitro = [];

    for (let index = 0; index < MUNICIO.length; index++) {
      const element = MUNICIO[index];
      if (element.id.substring(0, 2) == id) {
        this.municiflitro.push(element);
      }
    }
  }

  /**
   * Activa el alta de un nuevo representante (antes cambiamosRepre en el componente).
   */
  cambiamosRepre(): void {
    this.cambioRepresentante = false;
    this.representanteok = false;
    this.existeRepresentante = false;
    this.documrepre = true;
    this.dniok = false;
    this.cambioRepresentantePideDocu = true;
  }

  /**
   * Restablece la consulta de DNI (antes usado por limpiadatosnuevoexpediente).
   */
  resetConsulta(): void {
    this.consultadni = new ConsultaDni();
    this.dniok = false;
  }

  /**
   * Restablece el wizard completo de "Nueva Solicitud" (antes usado por borraDatosSolicitud).
   */
  resetWizardNuevaSolicitud(): void {
    this.consultadni = new ConsultaDni();
    this.dniok = false;
    this.documrepre = false;
    this.existeRepresentante = false;
  }

  private asignarDatosDni(response: ConsultaDni): void {
    this.nombredni = response.desPerEntid;
    this.apellido1dni = response.apellido1;
    this.apellido2dni = response.apellido2;
    this.direcciondni = response.dirPosta;
    this.cpdni = response.codPosta;
    this.provinciadni = response.provincia;
    this.idhispersodni = response.idHisPerso;
    this.idpersodni = response.idPerso;
    this.nommunicipiodni = response.municipio;
  }
}
