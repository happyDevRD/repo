import { HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { TareaTramiteExpedienteEditar, VerExpediente } from '../../expedientes';
import { ExpedientesService } from '../../expedientes.service';

export interface TareaBotonesVisibles {
  veoXml: boolean;
  verAccionesdeTarea: boolean;
  puedoEditarTarea: boolean;
  veoBorrar: boolean;
  veoGenerarSalida: boolean;
  veoNotificacion: boolean;
  veoPropuestaResolucion: boolean;
  veoFinalizar: boolean;
  veoFirmaAtendida: boolean;
  veoFirmaDEsatendida: boolean;
}

const BOTONES_PROPIETARIO: TareaBotonesVisibles = {
  veoXml: true,
  verAccionesdeTarea: true,
  puedoEditarTarea: true,
  veoBorrar: true,
  veoGenerarSalida: true,
  veoNotificacion: true,
  veoPropuestaResolucion: true,
  veoFinalizar: true,
  veoFirmaAtendida: false,
  veoFirmaDEsatendida: false,
};

const BOTONES_OTRO_USUARIO: TareaBotonesVisibles = {
  veoXml: false,
  verAccionesdeTarea: false,
  puedoEditarTarea: false,
  veoBorrar: false,
  veoGenerarSalida: false,
  veoNotificacion: false,
  veoPropuestaResolucion: false,
  veoFinalizar: false,
  veoFirmaAtendida: true,
  veoFirmaDEsatendida: true,
};

export function botonesTareaPorUsuario(
  usuarioTarea: string,
  usuarioActual: string | null,
  instructorExpediente: string,
): TareaBotonesVisibles {
  const esPropietario =
    usuarioTarea === usuarioActual || usuarioActual === instructorExpediente;
  return esPropietario ? { ...BOTONES_PROPIETARIO } : { ...BOTONES_OTRO_USUARIO };
}

export function calcularVeoconviertePDF(nombreArchivo: string): boolean {
  const trimmed = (nombreArchivo || '').trim();
  const fileIsPdf = trimmed.toLowerCase().endsWith('.pdf');
  const fileError = trimmed.includes('Error al buscar el archivo');
  return !trimmed || fileIsPdf || fileError;
}

export function calcularBorrarconfirma(firmado: string): boolean {
  return firmado !== '1';
}

export function calcularTareayafirmada(firmado: string): boolean {
  return !firmado;
}

export interface TareaTramiteSeleccionRow {
  id: number
  numero: number | string
  descripcion: string
  nombreArchivo?: string | null
  archivo?: number | string | null
  firmado?: string | number | null
  usuario: string
  numRegis?: string | number | null
  tareaProcedimiento: number
  tipAnexo?: string | number | null
  docAport?: string | number | null
  documentacion?: string | number | null
  tipDocEni?: string | number | null
  fecInicio?: string | null
  fecFin?: string | null
  propuestaResolucion?: string | number | boolean | null
  /** Estado de plazo del listado API: VERDE | AMARILLO | ROJO */
  color?: string | null
  fecPlazo?: string | null
  ejeNumNotif?: string | number | null
  idAnunc?: string | number | null
}

export interface SeleccionTareaNuevaHost extends TareaBotonesVisibles {
  verExpediente: VerExpediente;
  user: string | null;
  usuContrl: string | null;
  idTarea: number;
  tareatramiteexpedienteeditar: TareaTramiteExpedienteEditar;
  tareatramiteexpedientever: unknown;
  veoconviertePDF: boolean;
  verAbreArchivo: boolean;
  borrarconfirma: boolean;
  tareayafirmada: boolean;
  numeroTareaTramite: number | string;
  descripTareaTramite: string;
  nombreArchivoTarea: string;
  nunRegisTarea: string | number | null;
  tareaprocedimientoid: number;
  anexoTarea: string | number | null;
  docAportadaTarea: string | number | null;
  DocumentacionTarea: string | number | null;
  docEniTarea: string | number | null;
  veoMetadatos: boolean;
  FecIniTarea: string;
  FecFinTarea: string | null;
  numeroArchiTarea: number | null;
  veopropuestaresolu: boolean;
  veoPropuestaResolucion: boolean;
  descripTarea: string;
  numeroArchivo: number;
  tareaProcedi: number;
  ejerNumExpedi: string;
  descargafichero: string;
  archivofirmantes: unknown;
  errorArchivoFirmantes: string;
  firmaAtendida: boolean;
  firmaDesatendida: boolean;
}

export interface SeleccionTareaNuevaCallbacks {
  cargaHistorico(id: number): void;
  getTramiteProcedimientoVer(id: number): void;
  getListaTareas(): void;
  leoMetadatos(archivo: number): void;
  gettipofirma(): void;
  getTemaDocumentoListar(): void;
  getUsuarioListar(id: number): void;
}

export function aplicarSeleccionTareaNueva(
  host: SeleccionTareaNuevaHost,
  rowData: TareaTramiteSeleccionRow,
  expedientesService: ExpedientesService,
  callbacks: SeleccionTareaNuevaCallbacks,
): void {
  callbacks.cargaHistorico(rowData.id);

  const nombreArchivo: string = (rowData.nombreArchivo || '').trim();
  const archivo = rowData.archivo ?? null;
  const firmado = String(rowData.firmado ?? '');

  host.veoconviertePDF = calcularVeoconviertePDF(nombreArchivo);
  host.verAbreArchivo = Boolean(archivo);
  host.borrarconfirma = calcularBorrarconfirma(firmado);
  host.tareayafirmada = calcularTareayafirmada(firmado);
  host.numeroTareaTramite = rowData.numero;
  host.descripTareaTramite = rowData.descripcion;

  Object.assign(
    host,
    botonesTareaPorUsuario(rowData.usuario, host.user, host.verExpediente.instructor),
  );

  const tareaProcedimientoId = Number(rowData.tareaProcedimiento)
  const tieneTareaProcedimiento = Number.isFinite(tareaProcedimientoId) && tareaProcedimientoId > 0

  if (tieneTareaProcedimiento) {
    expedientesService.getArchivoFirmantes(host.usuContrl!, rowData.id).subscribe({
      next: (archivofirmantes) => (host.archivofirmantes = archivofirmantes),
      error: (err: HttpErrorResponse) => (host.errorArchivoFirmantes = err.error?.text ?? err.error?.message),
    })
  } else {
    host.archivofirmantes = []
  }

  host.nombreArchivoTarea = nombreArchivo;
  host.nunRegisTarea = rowData.numRegis ?? null;
  host.tareaprocedimientoid = rowData.tareaProcedimiento;
  if (tieneTareaProcedimiento) {
    callbacks.getTramiteProcedimientoVer(tareaProcedimientoId);
  }
  host.anexoTarea = rowData.tipAnexo ?? null;
  host.docAportadaTarea = rowData.docAport ?? null;
  host.DocumentacionTarea = rowData.documentacion ?? null;
  host.docEniTarea = rowData.tipDocEni ?? null;

  if (rowData.fecFin && archivo) {
    host.veoMetadatos = true;
    callbacks.leoMetadatos(Number(archivo));
  } else {
    host.veoMetadatos = false;
  }

  host.verAccionesdeTarea = !rowData.fecFin;
  host.FecIniTarea = rowData.fecInicio ? rowData.fecInicio.slice(0, 10) : '';
  host.FecFinTarea = rowData.fecFin ?? null;
  host.numeroArchiTarea = archivo != null ? Number(archivo) : null;
  callbacks.getListaTareas();
  host.veopropuestaresolu = !rowData.propuestaResolucion;
  host.veoPropuestaResolucion = !rowData.propuestaResolucion;
  host.tareatramiteexpedienteeditar.descripcion = rowData.descripcion;
  host.descripTarea = rowData.descripcion;
  host.idTarea = rowData.id;
  host.numeroArchivo = archivo != null ? Number(archivo) : 0;
  host.tareaProcedi = rowData.tareaProcedimiento;
  host.numeroTareaTramite = rowData.numero;
  host.ejerNumExpedi = `${host.verExpediente.ejercicio}/${host.verExpediente.numero}`;

  if (tieneTareaProcedimiento) {
    callbacks.gettipofirma();
    callbacks.getUsuarioListar(tareaProcedimientoId);
  } else {
    host.firmaAtendida = false
    host.firmaDesatendida = false
  }
  callbacks.getTemaDocumentoListar();

  expedientesService.getTareaTramiteExpVer(rowData.id).subscribe({
    next: (ver) => (host.tareatramiteexpedientever = ver),
  });

  const sinespacios = host.usuContrl?.replaceAll(' ', '');
  host.descargafichero = `${environment.apiUrl}archivo/descargaTarea/${host.numeroArchivo}/${sinespacios}`;
}
