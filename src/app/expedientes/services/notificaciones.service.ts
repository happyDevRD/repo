import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {
  CrearNotificacion,
  LeerNotificacion,
  ModeloTeuCrear,
  MotivoNotificacionesListar,
  NotificadorListar
} from "../expedientes";
import {map, Observable, catchError} from "rxjs";
import {HttpClient, HttpHeaders, HttpErrorResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificacionesService {

  public httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) { }

  private getUsuContr(): string | null {
    return sessionStorage.getItem('user') || localStorage.getItem('user');
  }

  public getReceptorNofitiListar(): Observable<any> {
    let url: string = `${environment.apiUrl}receptorNotificacion/listar`;
    return this.http.get(url);
  }


  // public getMotivoNofitiListar(): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificador/listar`;
  //   return this.http.get(url);
  // }
  public getMotivoNofitiListar(): Observable<MotivoNotificacionesListar[]> {
    return this.http.get(`${environment.apiUrl}motivoNotificacion/listar`).pipe(
      map(response => response as MotivoNotificacionesListar[])
    );
  }


  // public getNotificadorListar(): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificador/listar`;
  //   return this.http.get(url);
  // }
  public getNotificadorListar(): Observable<NotificadorListar[]> {
    return this.http.get(`${environment.apiUrl}notificador/listar`).pipe(
      map(response => response as NotificadorListar[])
    );
  }



  // public getNotificacionListar(ejercicio: number, numero: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/listar/${ejercicio}/${numero}`;
  //   return this.http.get(url);
  // }
  public getNotificacionListar(ejer: number, nume: number): Observable<LeerNotificacion[]> {
    return this.http.get(`${environment.apiUrl}notificacion/listar/${ejer}/${nume}`).pipe(
      map(response => response as LeerNotificacion[])
    );
  }

  // public getNotificacionVer(id: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/ver/${id}`;
  //   return this.http.get(url);
  // }
  public getNotificacionVer(id: number): Observable<LeerNotificacion[]> {
    return this.http.get(`${environment.apiUrl}notificacion/ver/${id}`).pipe(
      map(response => response as LeerNotificacion[])
    );
  }

  // public crearNotificacion(notificacion: CrearNotificacion, idTarea: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/crear/${idTarea}`;
  //   return this.http.post(url, notificacion, { headers: this.httpHeaders });
  // }
  public crearNotificacion(notificacion: CrearNotificacion, idTarea: number): Observable<any> {
    console.log("* *************** crearnotificacion ************************");
    console.log('NUEVA NOTIFICACION DESDE SERVICE:', JSON.stringify(notificacion, null, 2));
    
    return this.http.post<any>(`${environment.apiUrl}notificacion/crear/${idTarea}`, notificacion, {
      headers: this.httpHeaders
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error en servicio crearNotificacion:', error);
        console.error('Datos enviados:', notificacion);
        throw error;
      })
    );
  }

  // public deleteNotificacion(idNotifi: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/borrar/${idNotifi}`;
  //   return this.http.delete(url);
  // }
  deleteNotificacion(idNotifi: any): Observable<CrearNotificacion> {
    const httpHeaders = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    return this.http.delete<CrearNotificacion>(`${environment.apiUrl}notificacion/borrar/${idNotifi}`, {headers: httpHeaders})
  }

  // public enviarNotificacion(notificacion: CrearNotificacion, idNotificacion: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/enviar/${idNotificacion}`;
  //   return this.http.post(url, notificacion, { headers: this.httpHeaders });
  // }
  public enviarNotificacion(datosEnvio: any, idnotifi: any): Observable<any> {
    // Solo enviar los campos mínimos necesarios para el envío
    const datosMinimos = {
      "idNotif": idnotifi,
      "situacion": 2, // Cambiar a ENVIADA
      "fecEnvio": datosEnvio.fecEnvio || new Date().toISOString().split('T')[0],
      "usuContr": datosEnvio.usuContr || this.getUsuContr()
    };
    
    console.log('Datos mínimos para enviar notificación:', JSON.stringify(datosMinimos, null, 2));
    
    // Convertir a string como en otros métodos
    let keys = JSON.stringify(datosMinimos);
    
    // Usar directamente el endpoint de edición general con datos mínimos
    return this.http.put<any>(`${environment.apiUrl}notificacion/editar/`, keys, { 
      headers: this.httpHeaders 
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al enviar notificación:', error);
        console.log('Datos enviados:', datosMinimos);
        throw error;
      })
    );
  }

  // public recepcionarNotificacion(notificacion: CrearNotificacion, idNotificacion: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/recepcionar/${idNotificacion}`;
  //   return this.http.post(url, notificacion, { headers: this.httpHeaders });
  // }
  public recepcionarNotificacion(crearnotificacion: CrearNotificacion, idnotifi: any): Observable<any> {
    let varios = {
      "idNotif"     : idnotifi,
      "fecRecNotif" : crearnotificacion.fecRecNotif,
      "situacion"   : crearnotificacion.situacion,
      "receptor"    : crearnotificacion.receptor,
      "observacion" : crearnotificacion.observacion
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVA NOTIFICACION DESDE SERVICE: ${keys}`);
    return this.http.put<CrearNotificacion>(`${environment.apiUrl}notificacion/editar/`, keys, {headers: this.httpHeaders});
  }


  // public anularNotificacion(notificacion: CrearNotificacion, idNotificacion: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/anular/${idNotificacion}`;
  //   return this.http.post(url, notificacion, { headers: this.httpHeaders }); }
  public anularNotificacion(crearnotificacion: CrearNotificacion, idnotifi: any): Observable<any> {
    let varios = {
      "idNotif"     : idnotifi,
      "situacion"   : crearnotificacion.situacion,
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVA NOTIFICACION DESDE SERVICE: ${keys}`);
    return this.http.put<CrearNotificacion>(`${environment.apiUrl}notificacion/editar/`, keys, {headers: this.httpHeaders});
  }

  // public editarNotificacion(notificacion: CrearNotificacion, idNotificacion: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/editar/${idNotificacion}`;
  //   return this.http.put(url, notificacion, { headers: this.httpHeaders }); }
  public editarNotificacion(crearnotificacion: CrearNotificacion, idnotifi: any): Observable<any> {
    let varios = {
      "idNotif": idnotifi,
      "personaEntidad"  : crearnotificacion.personaEntidad,
      "desNotificador": crearnotificacion.desNotificador,
      "desMotNotif": crearnotificacion.desMotNotif,
      "desSituacion": crearnotificacion.desSituacion,
      "ejeNotif": crearnotificacion.ejeNotif,
      "numNotif": crearnotificacion.numNotif,
      "fecNotif": crearnotificacion.fecNotif,
      "fecRecNotif": crearnotificacion.fecRecNotif,
      "idHisPerso": crearnotificacion.idHisPerso,
      "idPerso": crearnotificacion.idPerso,
      "situacion": crearnotificacion.situacion,
      "motNotif": crearnotificacion.motNotif,
      "receptor": crearnotificacion.receptor,
      "numBop": crearnotificacion.numBop,
      "bop": crearnotificacion.bop,
      "fecEmiBop": crearnotificacion.fecEmiBop,
      "fecPubBop": crearnotificacion.fecPubBop,
      "notificador": crearnotificacion.notificador2,
      "codProvi": crearnotificacion.codProvi,
      "codMunic": crearnotificacion.codMunic,
      "tipVial": crearnotificacion.tipVial,
      "desVial": crearnotificacion.desVial,
      "numInfer": crearnotificacion.numInfer,
      "letInfer": crearnotificacion.letInfer,
      "numSuper": crearnotificacion.numSuper,
      "bloque": crearnotificacion.bloque,
      "portal": crearnotificacion.portal,
      "escalera": crearnotificacion.escalera,
      "planta": crearnotificacion.planta,
      "puerta": crearnotificacion.puerta,
      "localidad": crearnotificacion.localidad,
      "domicilio": crearnotificacion.domicilio,
      "codPosta": crearnotificacion.codPosta,
      "fecArchi": crearnotificacion.fecArchi,
      "ejeExped": crearnotificacion.ejeExped,
      "numExped": crearnotificacion.numExped,
      "observacion": crearnotificacion.observacion,
      "fecRegistSalid": crearnotificacion.fecRegistSalid,
      "numRegisSalid": crearnotificacion.numRegisSalid,
      "fecEnvio": crearnotificacion.fecEnvio,
      "forNotif": crearnotificacion.forNotif,
      "fecCaduc": crearnotificacion.fecCaduc,
      "numEnvioTeu": crearnotificacion.numEnvioTeu,
      "codArchi": crearnotificacion.codArchi,
      "codArchiAcuse": crearnotificacion.codArchiAcuse,
      "usuContr": crearnotificacion.usuContr,
      "edicionManual": true  // Flag para indicar que es una edición manual
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVA NOTIFICACION DESDE SERVICE: ${keys}`);
    console.log('Campos específicos que se envían como null:', {
      notificador: varios.notificador,
      receptor: varios.receptor,
      motNotif: varios.motNotif,
      fecRecNotif: varios.fecRecNotif,
      observacion: varios.observacion
    });
    return this.http.put<CrearNotificacion>(`${environment.apiUrl}notificacion/editar/`, keys, {headers: this.httpHeaders});
  }

  // public PublicarNotificacion(notificacion: CrearNotificacion, idNotificacion: number): Observable<any> {
  //   let url: string = `${environment.apiUrl}notificacion/publicar/${idNotificacion}`;
  //   return this.http.put(url, notificacion, { headers: this.httpHeaders }); }
  public PublicarNotificacion(crearnotificacion: CrearNotificacion, idnotifi: number): Observable<any> {
    let varios = {
      "idNotif"       : idnotifi,
      "fecNotif"      : crearnotificacion.fecNotif,
      "fecRecNotif"   : crearnotificacion.fecRecNotif,
      "situacion"     : crearnotificacion.situacion,
      "numBop"        : crearnotificacion.numBop,
      "bop"           : crearnotificacion.bop,
      "fecEmiBop"     : crearnotificacion.fecEmiBop,
      "fecPubBop"     : crearnotificacion.fecPubBop,
      "fecEnvio"      : crearnotificacion.fecEnvio,
      "fecCaduc"      : crearnotificacion.fecCaduc,
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVA NOTIFICACION DESDE SERVICE: ${keys}`);
    return this.http.put<CrearNotificacion>(`${environment.apiUrl}notificacion/editar/`, keys, {headers: this.httpHeaders});
  }

  // public crearModeloTeuFichero(modeloteucrear: ModeloTeuCrear, idNotificacion: number, TextoLegal: string): Observable<any> {
  //   let url: string = `${environment.apiUrl}modeloTEU/crearFichero/${idNotificacion}`;
  //   const formData: FormData = new FormData();
  //   formData.append('file', new Blob([TextoLegal], { type: 'text/xml' }));
  //   formData.append('modeloTEU', JSON.stringify(modeloteucrear));
  //   return this.http.post(url, formData);
  // }
  public enviarANotifica(idNotif: number): Observable<any> {
    const body = { usuContr: this.getUsuContr() };
    return this.http.post(`${environment.apiUrl}notificacion/enviarNotifica/${idNotif}`, body, {
      headers: this.httpHeaders
    });
  }

  public sincronizarNotifica(idNotif: number): Observable<any> {
    const body = { usuContr: this.getUsuContr() };
    return this.http.post(`${environment.apiUrl}notificacion/sincronizarNotifica/${idNotif}`, body, {
      headers: this.httpHeaders
    });
  }

  public consultarEnvioNotifica(idNotif: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}notificacion/envioNotifica/${idNotif}`);
  }

  public crearModeloTeuFichero(modeloteucrear: ModeloTeuCrear, idnotif: number, textolegal: string): Observable<any> {
    let varios = {
      "idNotif"       : idnotif,
      "email"         : modeloteucrear.email,
      "url"           : modeloteucrear.url,
      "indMater"      : modeloteucrear.idMater,
      "fecGener"      : modeloteucrear.fecGener,
      "fecSolic"      : modeloteucrear.fecSolic,
      "fecFirma"      : modeloteucrear.fecFirma,
      "forPubli"      : modeloteucrear.forPubli,
      "procedimiento" : modeloteucrear.procedimiento,
      "idModel"       : modeloteucrear.idModel,
      "incLgt"        : modeloteucrear.incLgt,
      "texPlura"      : modeloteucrear.texPlura,
      "datPerso"      : modeloteucrear.datPerso,
      "texlegal"      : textolegal,
      "usuContr"      : this.getUsuContr()
    }
    let keys = JSON.stringify(varios);
    console.log(`NUEVO MODELO T.E.U.: ${keys}`);
    return this.http.post<ModeloTeuCrear>(`${environment.apiUrl}modeloTeu/fichero`, keys, {headers: this.httpHeaders});
  }
}
