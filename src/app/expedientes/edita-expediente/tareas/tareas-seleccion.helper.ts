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
  numeroTareaTramite: unknown;
  descripTareaTramite: unknown;
  nombreArchivoTarea: string;
  nunRegisTarea: unknown;
  tareaprocedimientoid: unknown;
  anexoTarea: unknown;
  docAportadaTarea: unknown;
  DocumentacionTarea: unknown;
  docEniTarea: unknown;
  veoMetadatos: boolean;
  FecIniTarea: string;
  FecFinTarea: unknown;
  numeroArchiTarea: unknown;
  veopropuestaresolu: boolean;
  descripTarea: string;
  numeroArchivo: unknown;
  tareaProcedi: number;
  ejerNumExpedi: string;
  descargafichero: string;
  archivofirmantes: unknown;
  errorArchivoFirmantes: string;
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
  rowData: any,
  expedientesService: ExpedientesService,
  callbacks: SeleccionTareaNuevaCallbacks,
): void {
  callbacks.cargaHistorico(rowData.id);

  const nombreArchivo: string = (rowData.nombreArchivo || '').trim();
  const archivo = rowData.archivo;

  host.veoconviertePDF = calcularVeoconviertePDF(nombreArchivo);
  host.verAbreArchivo = Boolean(archivo);
  host.borrarconfirma = calcularBorrarconfirma(rowData.firmado);
  host.tareayafirmada = calcularTareayafirmada(rowData.firmado);
  host.numeroTareaTramite = rowData.numero;
  host.descripTareaTramite = rowData.descripcion;

  Object.assign(
    host,
    botonesTareaPorUsuario(rowData.usuario, host.user, host.verExpediente.instructor),
  );

  expedientesService.getArchivoFirmantes(host.usuContrl!, rowData.id).subscribe({
    next: (archivofirmantes) => (host.archivofirmantes = archivofirmantes),
    error: (err: HttpErrorResponse) => (host.errorArchivoFirmantes = err.error?.text),
  });

  host.nombreArchivoTarea = nombreArchivo;
  host.nunRegisTarea = rowData.numRegis;
  host.tareaprocedimientoid = rowData.tareaProcedimiento;
  callbacks.getTramiteProcedimientoVer(rowData.tareaProcedimiento);
  host.anexoTarea = rowData.tipAnexo;
  host.docAportadaTarea = rowData.docAport;
  host.DocumentacionTarea = rowData.documentacion;
  host.docEniTarea = rowData.tipDocEni;

  if (rowData.fecFin && archivo) {
    host.veoMetadatos = true;
    callbacks.leoMetadatos(archivo);
  } else {
    host.veoMetadatos = false;
  }

  host.verAccionesdeTarea = !rowData.fecFin;
  host.FecIniTarea = rowData.fecInicio ? rowData.fecInicio.slice(0, 10) : '';
  host.FecFinTarea = rowData.fecFin;
  host.numeroArchiTarea = archivo;
  callbacks.getListaTareas();
  host.veopropuestaresolu = !rowData.propuestaResolucion;
  host.tareatramiteexpedienteeditar.descripcion = rowData.descripcion;
  host.descripTarea = rowData.descripcion;
  host.idTarea = rowData.id;
  host.numeroArchivo = archivo;
  host.tareaProcedi = rowData.tareaProcedimiento;
  host.numeroTareaTramite = rowData.numero;
  host.ejerNumExpedi = `${host.verExpediente.ejercicio}/${host.verExpediente.numero}`;

  callbacks.gettipofirma();
  callbacks.getTemaDocumentoListar();
  callbacks.getUsuarioListar(rowData.tareaProcedimiento);

  expedientesService.getTareaTramiteExpVer(rowData.id).subscribe({
    next: (ver) => (host.tareatramiteexpedientever = ver),
  });

  const sinespacios = host.usuContrl?.replaceAll(' ', '');
  host.descargafichero = `${environment.apiUrl}archivo/descargaTarea/${host.numeroArchivo}/${sinespacios}`;
}
