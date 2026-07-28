import { DestroyRef, Injectable, inject } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { HttpErrorResponse } from '@angular/common/http'
import { ConsultaDni, CrearPersonaEntidad, RepresentanteExpLIstar } from '../../expedientes/expedientes'
import { CreaSolicitudNuevo, EditarSolicitud } from '../models'
import { PersonaEntidadApiService } from '../../../core/service/persona/persona-entidad-api.service'
import { NotificationService } from '../../../core/service/notification.service'
import { SolicitudesGridHost } from './solicitudes-grid.facade'
import { MUNICIO } from 'src/app/core/constants/datos'

export interface SolicitudesPersonaHost extends SolicitudesGridHost {
  creasolicitud: CreaSolicitudNuevo
  editasolicitud: EditarSolicitud
  representanteexplistar: RepresentanteExpLIstar
  crearpersonaentidad: CrearPersonaEntidad
  seleccionoRepre: string | String
}

/**
 * Consulta de DNI / persona / representante y wizard de Nueva Solicitud.
 */
@Injectable()
export class SolicitudesPersonaFacade {
  private readonly destroyRef = inject(DestroyRef)

  public nombredni: string
  public apellido1dni: any
  public apellido2dni: any
  public direcciondni: string
  public cpdni: any
  public provinciadni: any
  public idhispersodni: any
  public idpersodni: any
  public nommunicipiodni: any

  public dniok = false
  public existepersonaentidad = false
  public existeRepresentante = false
  public representanteok = false
  public vernumerorepre = false
  public cambioRepresentante = false
  public cambioRepresentantePideDocu = false
  public documrepre = false
  public controlpersonaentidadcrear = false

  public InteresadoSolicitud: any
  public dirPosta: string
  public codPosta: string
  public provincia: string
  public Municipio: string
  public representanteSolicitud = ''

  /** Lista plana de representantes del interesado (sustituye jqxGrid en alta). */
  public representantesLista: RepresentanteExpLIstar[] = []
  public representanteSeleccionadoKey: string | null = null
  public cargandoRepresentantes = false
  public buscandoInteresado = false

  /** Vista del representante localizado por documento (sin pisar datos del interesado). */
  public repreNombreVista = ''
  public repreDireccionVista = ''
  public repreCpVista = ''
  public repreProvinciaVista = ''
  public repreMunicipioVista = ''

  public consultadni: ConsultaDni = new ConsultaDni()

  public selectnombre = false
  public selectape1 = false
  public selectape2 = false
  public selectRazonSocial = false
  public selectCIF = false
  public selectTRESIDENTE = false

  public municiflitro: any[] = []

  constructor(
    private readonly personaEntidadApi: PersonaEntidadApiService,
    private readonly notificationService: NotificationService,
  ) {}

  consultarInteresado(host: SolicitudesPersonaHost, dni: string): void {
    const documento = String(dni ?? '').trim()
    if (!documento) {
      return
    }

    this.dniok = false
    this.existepersonaentidad = false
    this.limpiarRepresentantesAlta(host)
    this.buscandoInteresado = true
    this.nombredni = ''
    this.direcciondni = ''
    this.cpdni = ''
    this.provinciadni = ''
    this.nommunicipiodni = ''

    this.personaEntidadApi.getDni2(documento).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        this.buscandoInteresado = false
        this.asignarDatosDni(response)

        host.creasolicitud.idPerso = response.idPerso
        host.creasolicitud.idHisPerso = response.idHisPerso

        if (response.nombre) {
          this.dniok = true
          this.existepersonaentidad = false
          this.InteresadoSolicitud = response.desPerEntid
          this.dirPosta = response.dirPosta
          this.codPosta = response.codPosta?.toString?.() ?? ''
          this.provincia = response.provincia
          this.Municipio = response.municipio
          host.editasolicitud.idPerso = response.idPerso
          host.editasolicitud.idHisPerso = response.idHisPerso
          this.controlpersonaentidadcrear = true
          this.cargarRepresentantesLista(response.idPerso, response.idHisPerso)
          return
        }

        this.dniok = false
        this.existepersonaentidad = true
        this.controlpersonaentidadcrear = false
      },
      error: (err: HttpErrorResponse) => {
        this.buscandoInteresado = false
        if (err.status == 404) {
          this.notificationService.error(
            'El interesado no está registrado. Por favor introduzca los datos para el alta.',
          )
          this.existepersonaentidad = true
          this.dniok = false
          return
        }
        this.existepersonaentidad = false
        this.dniok = false
      },
    })
  }

  cargarRepresentantesLista(idPerso: number | string, idHisPerso: number | string): void {
    if (!idPerso || !idHisPerso) {
      this.representantesLista = []
      return
    }

    this.cargandoRepresentantes = true
    this.personaEntidadApi.listarRepresentantes(idPerso, idHisPerso).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (lista) => {
        this.cargandoRepresentantes = false
        this.representantesLista = lista ?? []
      },
      error: () => {
        this.cargandoRepresentantes = false
        this.representantesLista = []
      },
    })
  }

  seleccionarRepresentanteLista(host: SolicitudesPersonaHost, item: RepresentanteExpLIstar): void {
    this.representanteSeleccionadoKey = this.representanteKey(item)
    host.seleccionoRepre = '1'
    host.representanteexplistar.idPerso = item.idPerso
    host.representanteexplistar.idHisPerso = item.idHisPerso
    host.representanteexplistar.desPerEntid = item.desPerEntid
    host.representanteexplistar.dirPosta = item.dirPosta
    host.creasolicitud.idRepre = item.idPerso
    host.creasolicitud.idHisRepre = item.idHisPerso
    this.documrepre = false
    this.existeRepresentante = false
    this.representanteok = false
    this.cambioRepresentante = false
  }

  limpiarRepresentantesAlta(host: SolicitudesPersonaHost): void {
    this.representantesLista = []
    this.representanteSeleccionadoKey = null
    this.cargandoRepresentantes = false
    this.documrepre = false
    this.existeRepresentante = false
    this.representanteok = false
    this.cambioRepresentante = false
    this.cambioRepresentantePideDocu = false
    this.repreNombreVista = ''
    this.repreDireccionVista = ''
    this.repreCpVista = ''
    this.repreProvinciaVista = ''
    this.repreMunicipioVista = ''
    host.seleccionoRepre = ''
    host.creasolicitud.idRepre = null
    host.creasolicitud.idHisRepre = null
    host.representanteexplistar = new RepresentanteExpLIstar()
  }

  representanteKey(item: RepresentanteExpLIstar): string {
    return `${item.idPerso}-${item.idHisPerso}`
  }

  consultarRepresentante(host: SolicitudesPersonaHost, dni: string): void {
    const documento = String(dni ?? '').trim()
    if (!documento) {
      return
    }

    this.personaEntidadApi.getDni2(documento).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        host.creasolicitud.idRepre = response.idPerso
        host.creasolicitud.idHisRepre = response.idHisPerso

        if (response.nombre) {
          this.representanteok = true
          this.existeRepresentante = false
          this.vernumerorepre = true
          this.cambioRepresentantePideDocu = false
          this.documrepre = true
          this.repreNombreVista = response.desPerEntid
          this.repreDireccionVista = response.dirPosta
          this.repreCpVista = response.codPosta?.toString?.() ?? ''
          this.repreProvinciaVista = response.provincia
          this.repreMunicipioVista = response.municipio
          host.seleccionoRepre = '1'
          host.representanteexplistar.idPerso = response.idPerso
          host.representanteexplistar.idHisPerso = response.idHisPerso
          host.representanteexplistar.desPerEntid = response.desPerEntid
          return
        }

        this.existeRepresentante = true
        this.representanteok = false
        this.documrepre = true
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) {
          this.notificationService.error({
            title: 'El Representante no está registrado',
            text: 'Por favor introduzca los datos para el alta',
          })
          this.existeRepresentante = true
          this.representanteok = false
          return
        }
        this.existeRepresentante = false
        this.representanteok = false
      },
    })
  }

  consultarRepresentanteExpediente(host: SolicitudesPersonaHost, idPerso: number, idHisPerso: number): void {
    this.personaEntidadApi.getRepresentante(idPerso, idHisPerso).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (response) => {
        if (!response.idPerso) {
          host.representanteexplistar = new RepresentanteExpLIstar()
          return
        }

        host.representanteexplistar.idPerso = response.idPerso
        host.editasolicitud.idRepre = response.idPerso
        host.editasolicitud.idHisRepre = response.idHisPerso
        host.representanteexplistar.idHisPerso = response.idHisPerso
        host.representanteexplistar.numDocum = response.numDocum
        host.representanteexplistar.tipPerso = response.tipPerso
        host.representanteexplistar.nombre = response.nombre
        host.representanteexplistar.particula1 = response.particula1
        host.representanteexplistar.apellido1 = response.apellido1
        host.representanteexplistar.particula2 = response.particula2
        host.representanteexplistar.apellido2 = response.apellido2
        host.representanteexplistar.razSocia = response.razSocia
        host.representanteexplistar.razSocReduc = response.razSocReduc
        host.representanteexplistar.desPerEntid = response.desPerEntid
        host.representanteexplistar.localidad = response.localidad
        host.representanteexplistar.codPosta = response.codPosta
        host.representanteexplistar.dirPosta = response.dirPosta
        host.representanteexplistar.municipio = response.municipio
        host.representanteexplistar.provincia = response.provincia
        this.representanteSolicitud = response.desPerEntid
      },
      error: (error: HttpErrorResponse) => {
        if (error.status != 404) {
          return
        }
        host.representanteexplistar = new RepresentanteExpLIstar()
        host.creasolicitud.idHisRepre = null
        host.creasolicitud.idRepre = null
        host.editasolicitud.idHisRepre = null
        host.editasolicitud.idRepre = null
      },
    })

    this.representanteSolicitud = ''
  }

  crearPersonaEntidad(host: SolicitudesPersonaHost, dni: string): void {
    const datos = host.crearpersonaentidad
    const tieneDatos =
      datos.nombre || datos.apellido1 || datos.apellido2 || datos.dirPosta || datos.municipio || datos.provincia

    if (!tieneDatos) {
      this.controlpersonaentidadcrear = false
      this.notificationService.incompleteFields(
        'Por favor, complete todos los campos obligatorios del interesado.',
      )
      return
    }

    this.controlpersonaentidadcrear = true
    this.personaEntidadApi.crearPersonaEntidad(datos, dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(() => {
      this.controlpersonaentidadcrear = true
    })
  }

  selecTipPerso(valor: any): void {
    switch (valor) {
      case '1':
        this.selectnombre = true
        this.selectape1 = true
        this.selectape2 = true
        this.selectRazonSocial = false
        break
      case '2':
        this.selectnombre = false
        this.selectape1 = false
        this.selectape2 = false
        this.selectRazonSocial = true
        break
      case '3':
        this.selectnombre = true
        this.selectape1 = true
        this.selectape2 = false
        this.selectRazonSocial = false
        break
    }
  }

  gestimunicip(id: any): void {
    this.municiflitro = []

    for (let index = 0; index < MUNICIO.length; index++) {
      const element = MUNICIO[index]
      if (element.id.substring(0, 2) == id) {
        this.municiflitro.push(element)
      }
    }
  }

  /** Activa el alta de un nuevo representante sin tocar el estado del interesado. */
  cambiamosRepre(): void {
    this.representanteSeleccionadoKey = null
    this.cambioRepresentante = false
    this.representanteok = false
    this.existeRepresentante = false
    this.documrepre = true
    this.cambioRepresentantePideDocu = true
    this.repreNombreVista = ''
    this.repreDireccionVista = ''
    this.repreCpVista = ''
    this.repreProvinciaVista = ''
    this.repreMunicipioVista = ''
  }

  cancelarAltaRepresentante(host: SolicitudesPersonaHost): void {
    this.documrepre = false
    this.existeRepresentante = false
    this.representanteok = false
    this.cambioRepresentante = false
    this.cambioRepresentantePideDocu = false
    this.repreNombreVista = ''
    this.repreDireccionVista = ''
    this.repreCpVista = ''
    this.repreProvinciaVista = ''
    this.repreMunicipioVista = ''
    host.creasolicitud.numDocumRepre = ''
    host.creasolicitud.nombreRepre = ''
    host.creasolicitud.apellido1Repre = ''
    host.creasolicitud.apellido2Repre = ''
    host.creasolicitud.dirPostaRepre = ''
    host.creasolicitud.codPostaRepre = undefined as unknown as number
    host.creasolicitud.codProviRepre = null
    host.creasolicitud.codMunicRepre = null
  }

  resetConsulta(): void {
    this.consultadni = new ConsultaDni()
    this.dniok = false
  }

  resetWizardNuevaSolicitud(): void {
    this.consultadni = new ConsultaDni()
    this.dniok = false
    this.existepersonaentidad = false
    this.existeRepresentante = false
    this.representanteok = false
    this.vernumerorepre = false
    this.cambioRepresentante = false
    this.cambioRepresentantePideDocu = false
    this.documrepre = false
    this.controlpersonaentidadcrear = false
    this.buscandoInteresado = false
    this.cargandoRepresentantes = false
    this.representantesLista = []
    this.representanteSeleccionadoKey = null
    this.selectnombre = false
    this.selectape1 = false
    this.selectape2 = false
    this.selectRazonSocial = false
    this.selectCIF = false
    this.selectTRESIDENTE = false
    this.municiflitro = []
    this.nombredni = ''
    this.apellido1dni = ''
    this.apellido2dni = ''
    this.direcciondni = ''
    this.cpdni = ''
    this.provinciadni = ''
    this.nommunicipiodni = ''
    this.idhispersodni = null
    this.idpersodni = null
    this.InteresadoSolicitud = ''
    this.dirPosta = ''
    this.codPosta = ''
    this.provincia = ''
    this.Municipio = ''
    this.representanteSolicitud = ''
    this.repreNombreVista = ''
    this.repreDireccionVista = ''
    this.repreCpVista = ''
    this.repreProvinciaVista = ''
    this.repreMunicipioVista = ''
  }

  private asignarDatosDni(response: ConsultaDni): void {
    this.nombredni = response.desPerEntid
    this.apellido1dni = response.apellido1
    this.apellido2dni = response.apellido2
    this.direcciondni = response.dirPosta
    this.cpdni = response.codPosta
    this.provinciadni = response.provincia
    this.idhispersodni = response.idHisPerso
    this.idpersodni = response.idPerso
    this.nommunicipiodni = response.municipio
  }
}
