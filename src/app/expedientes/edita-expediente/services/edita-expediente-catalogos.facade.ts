import { HttpErrorResponse } from '@angular/common/http';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { ConsultaDni, CrearTramiteExp, TareaTramiteExpedienteCrear, TemaDocumentoListar, VerMetadatos } from '../../expedientes';
import { TareaTramiteExpedienteVer } from '../../../core/models/tareaTramite/tarea-tramite-expediente-ver.dto';
import { TipoObjetoTributarioDto } from '../../../core/models/tipo-objeto-tributario.dto';
import { ExpedientesService } from '../../expedientes.service';
import { ProcedimientoService } from '../../../procedimientos/procedimiento.service';

export interface EditaExpedienteCatalogosHost {
  temadocumentolistar: TemaDocumentoListar[];
  tareaProcedimientoVer: TareaTramiteExpedienteVer;
  vermetadatos: VerMetadatos;
  tipoObjetoTributario: TipoObjetoTributarioDto[];
  fechaSistema: string;
  creartramiteexp: CrearTramiteExp;
  tareatramiteexpedientecrear: TareaTramiteExpedienteCrear;
  fechametadatabuena: string;
}

@Injectable()
export class EditaExpedienteCatalogosFacade {
  private readonly destroyRef = inject(DestroyRef);

  // Estado de la consulta de DNI del wizard de interesado/representante,
  // antes en EditaExpedienteComponent (consultadni, dniok, formanotificacion).
  public consultadni: ConsultaDni = new ConsultaDni();
  public dniok = false;
  public formanotificacion = false;

  constructor(
    private readonly expedientesService: ExpedientesService,
    private readonly procedimientoService: ProcedimientoService,
  ) {}

  fechaSistema(host: EditaExpedienteCatalogosHost): void {
    const hoy = new Date();
    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');
    host.fechaSistema = `${anio}-${mes}-${dia}`;
    host.creartramiteexp.fecTramite = host.fechaSistema;
    host.tareatramiteexpedientecrear.fecInicio = new Date();
  }

  solicitadni(host: EditaExpedienteCatalogosHost, dni: string): void {
    this.formanotificacion = true;
    this.expedientesService.getDni(dni).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (consultadni) => (this.consultadni = consultadni),
    });
    this.dniok = true;
  }

  getTemaDocumentoListar(host: EditaExpedienteCatalogosHost): void {
    this.expedientesService.getTemaDocumentoListar().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (temadocumentolistar) => (host.temadocumentolistar = temadocumentolistar),
    });
  }

  getTramiteProcedimientoVer(host: EditaExpedienteCatalogosHost, idtareP: number): void {
    this.procedimientoService.getTareaProcedimientoVer(idtareP).pipe(
      tap({
        next: (tareaProceDiver) => {
          host.tareaProcedimientoVer = tareaProceDiver;
        },
        error: (err: HttpErrorResponse) => {
          console.log('Error en Tarea Procedimiento: ' + err.error?.text);
        },
      }),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();
  }

  leoMetadatos(host: EditaExpedienteCatalogosHost, codfiche: number): void {
    this.expedientesService.getMetadatosVer(codfiche).pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (vermetadatos) => (host.vermetadatos = vermetadatos),
    });
  }

  getTipoObjetoTributario(host: EditaExpedienteCatalogosHost): void {
    this.expedientesService.getTipoObjetoTributario().pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe({
      next: (data) => (host.tipoObjetoTributario = data),
      error: (error) => console.error('Error al obtener la lista:', error),
    });
  }

  formatearFechaMetadata(host: EditaExpedienteCatalogosHost, fecha: Date): void {
    const fechaStr = fecha.toString();
    const anio = fechaStr.substring(0, 4);
    const mes = fechaStr.substring(5, 7);
    const dia = fechaStr.substring(8, 10);
    host.fechametadatabuena = `${dia}-${mes}-${anio}`;
  }
}
