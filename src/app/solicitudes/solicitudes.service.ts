import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpStatusCode} from '@angular/common/http';
import Swal from 'sweetalert2';
import {ActivatedRoute, Router} from '@angular/router';
import {map, Observable} from 'rxjs';
import {
  ConsultaDni,
  CreaSolicitud,
  CreaSolicitudNuevo,
  DocumentosListar,
  EditarSolicitud,
  EditExpediente,
  ExpedienteListar2,
  ProcediPermisos,
  SolicitudListar,
  UsuPermisos,
  VerSolicitud
} from './solicitudes';
import {environment} from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  public departamento = sessionStorage.getItem('departamento');
  public idOrgElemen = sessionStorage.getItem('idOrgEleme');
  public urlborrarsolicitud: string = `${environment.apiUrl}solicitud/borrar/`;
  public urlsolicilistar: string = `${environment.apiUrl}solicitud/listar`;
  public urlsolicilistarEstado: string = `${environment.apiUrl}solicitud/listarPorEstado`;
  public urlsolicicrear: string = `${environment.apiUrl}solicitud/crear`;
  public urlsoliciver: string = `${environment.apiUrl}solicitud/ver/`;
  public urldocsolicicrear: string = `${environment.apiUrl}documentoSolicitud/crear`;
  public urldocsolicilistar: string = `${environment.apiUrl}documentoSolicitud/listar`;
  public urldocsoliciborrar: string = `${environment.apiUrl}documentoSolicitud/borrar/`;
  public urlsolicieditar: string = `${environment.apiUrl}solicitud/editar/`;
  public urlsoliDni: string = `${environment.apiUrl}personaEntidad/ver/`;
  public urlsoliciProvi: string = `${environment.apiUrl}provincia/ver/`;
  public urlsoliciMunicipio: string = `${environment.apiUrl}municipio/ver/`;
  public urlPermisoProcedi: string = `${environment.apiUrl}organizacionUsuario/listar`;
  public urlPermisoProcediOrganizacion: string = `${environment.apiUrl}organizacionUsuario/usuDepTraExped/`;
  public urlexpedientelistar: string = `${environment.apiUrl}expediente/listar`;
  public urlexpedientecrear: string = `${environment.apiUrl}expediente/crear`;
  public urlexpedienteAsignaInstruc: string = `${environment.apiUrl}expediente/editar`;
  public urlAsignarA: string = `${environment.apiUrl}organizacionUsuario/usuDepTraExped/${this.idOrgElemen}`;


  public vacio: string = 'vacio';

  public response = new Response();
  public httpHeaders = new HttpHeaders(
    {'Content-Type': 'application/json'}
  );

  public user = sessionStorage.getItem('user');

  constructor(public http: HttpClient,
              public router: Router,
              public activatedRoute: ActivatedRoute,) {
  }

  getSolicitudes(): Observable<SolicitudListar[]> {
    return this.http.get(`${this.urlsolicilistar}/${this.idOrgElemen}`).pipe(
      map(response => response as SolicitudListar[])
    );
  }

  getSolicitudesfiltro(value: any): Observable<SolicitudListar[]> {
    console.log("solicitudes fltradas URL: " + `${this.urlsolicilistarEstado}/${value}/${this.idOrgElemen}`)
    return this.http.get(`${this.urlsolicilistarEstado}/${value}/${this.idOrgElemen}`).pipe(
      map(response => response as SolicitudListar[])
    );
  }

  getVerSolicitudes(id): Observable<VerSolicitud[]> {
    return this.http.get(`${this.urlsoliciver}/${id}`).pipe(
      map(response => response as VerSolicitud[])
    );
  }

  getAsignarA(): Observable<UsuPermisos[]> {
    console.log(`RUTA USUARIO: ${this.urlAsignarA}`)
    return this.http.get(`${this.urlAsignarA}`).pipe(
      map(response => response as UsuPermisos[])
    );
  }
  editaExpediente(editexpediente: EditExpediente, id: number, instructor: string): Observable<EditExpediente> {

    let result = JSON.stringify(editexpediente);
    let varios = {
      "idExpediente": id,
      "instructor": instructor
    }
    let keys = JSON.stringify(varios);
    let respuestaHttp = HttpStatusCode.AlreadyReported;
    let basura = HttpErrorResponse.name;
    let urlEdita: string = `${environment.apiUrl}expediente/editar/${id}`;
    let urlvacio: string = `${environment.apiUrl}solic/`

    console.log(`DATOS del id SOLICITUD!!! : ${id}`);
    console.log(`DATOS INSTRUCTOR!!! : ${instructor}`)
    console.log(`DATOS KEY!!! : ${keys}`)
    return this.http.put<EditExpediente>(urlEdita, keys, {headers: this.httpHeaders});
  }

  getDocumentosListar(): Observable<DocumentosListar[]> {
    return this.http.get(this.urldocsolicilistar).pipe(
      map(response => response as DocumentosListar[])
    );
  }

  getDni(dni): Observable<ConsultaDni> {
    let urldni: string = `${environment.apiUrl}personaEntidad/ver/${dni}`
    return this.http.get(urldni).pipe(
      map(response => response as ConsultaDni)
    );
  }


  creaSolicitud(creasolicitud): Observable<CreaSolicitudNuevo> {

    //conversion a  INT
    let codprovi = parseInt(creasolicitud.codProvi)
    let codMunic = parseInt(creasolicitud.codMunic)
    let codProviRepre = parseInt(creasolicitud.codProviRepre)
    let codMunicRepre = parseInt(creasolicitud.codMunicRepre)

    if (!creasolicitud.codProviRepre) {
      codProviRepre = 0;
      console.log("provinRepre : " + codProviRepre)
    }
    if (!creasolicitud.codMunicRepre) {
      codMunicRepre = 0;
      console.log("munirepre : " + codMunicRepre)
    }


    if (!creasolicitud.codProvi) {
      codprovi = 0;
      console.log("provin: " + codprovi)
    }
    if (!creasolicitud.codMunic) {
      codMunic = 0;
      console.log("muni : " + codMunic)
    }


    let result = JSON.stringify(creasolicitud);


    let varios = {
      "asunto": creasolicitud.asunto,
      "ejercicio": creasolicitud.ejercicio,
      "estado": "PENDIENTE",
      "fecInicio": creasolicitud.fecInicio,
      "departamento": this.idOrgElemen,
      "idPerso": creasolicitud.idPerso,
      "idHisPerso": creasolicitud.idHisPerso,
      "idHisDocum": creasolicitud.idHisDocum,
      "idDocum": creasolicitud.idDocum,
      "codProvi": codprovi,
      "codMunic": codMunic,
      "codPosta": creasolicitud.codPosta,
      "nombre": creasolicitud.nombre,
      "apellido1": creasolicitud.apellido1,
      "apellido2": creasolicitud.apellido2,
      "razSocia": creasolicitud.razSocia,
      "dirPosta": creasolicitud.dirPosta,
      "tipPerso": creasolicitud.tipPerso,
      "codLocal": creasolicitud.codLocal,
      "numDocum": creasolicitud.numDocum,
      "codProviRepre": codProviRepre,
      "codMunicRepre": codMunicRepre,
      "numDocumRepre": creasolicitud.numDocumRepre,
      "nombreRepre": creasolicitud.nombreRepre,
      "apellido1Repre": creasolicitud.apellido1Repre,
      "apellido2Repre": creasolicitud.apellido2Repre,
      "razSociaRepre": creasolicitud.razSociaRepre,
      "dirPostaRepre": creasolicitud.dirPostaRepre,
      "codPostaRepre": creasolicitud.codPostaRepre,
      // "idHisRepre": creasolicitud.idHisRepre,
      "idRepre": creasolicitud.idRepre,
      "usuario": creasolicitud.usuario,
      "expediente": creasolicitud.expediente,
      "usuContr": this.user,
      "idHisRepre": creasolicitud.idHisRepre,
      "formaNotifi": creasolicitud.formaNotifi,
      "email": creasolicitud.email
    }
    let keys = JSON.stringify(varios);
    console.log(`DATOS RECIBIDOS DESDE SERVICE: ${keys}`);
    return this.http.post<CreaSolicitudNuevo>(this.urlsolicicrear, keys, {headers: this.httpHeaders});

  }


  creaExpediente(id): Observable<any> {

    let varios = {
      "idsolicitud": id
    }
    let keys = JSON.stringify(varios);
    console.log(`DATOS ENVIADOS NUEVO EXPEDIENTE : ${keys}`);
    Swal.fire('Nuevo Expediente  ', `Expediente ${id} creado con éxito`, 'success');
    return this.http.post(this.urlexpedientecrear, keys, {headers: this.httpHeaders});

  }


  getPermisoProcedi(): Observable<ProcediPermisos[]> {
    console.log(`llamada a GETPERMISOPROCEDI : ${this.urlPermisoProcediOrganizacion}/${this.idOrgElemen}`)

    return this.http.get(`${this.urlPermisoProcediOrganizacion}/${this.idOrgElemen}`).pipe(
      map(response => response as ProcediPermisos[])
    );
  }

  getPermisoProcediA(): Observable<ProcediPermisos[]> {
    return this.http.get(this.urlPermisoProcedi).pipe(
      map(response => response as ProcediPermisos[])
    );
  }


  editaSolicitud(editasolicitud: EditarSolicitud, id: number): Observable<EditarSolicitud> {
    let idprocedi: number = id;
    let result = JSON.stringify(editasolicitud);


    let varios = {

      "asunto": editasolicitud.asunto,
      "fecInicio": editasolicitud.fecInicio,
      "estado": editasolicitud.estado,
      "usuario": editasolicitud.usuario,
      "motivoRechazo": editasolicitud.motivoRechazo,
      "departamento": this.idOrgElemen,
      "idHisPerso": editasolicitud.idHisPerso,
      "idPerso": editasolicitud.idPerso,
      "idHisDocum": editasolicitud.idHisDocum,
      "idDocum": editasolicitud.idDocum,
      "idRepre": editasolicitud.idRepre,
      "expediente": editasolicitud.expediente,
      "usuContr": this.user,
      "idHisRepre": editasolicitud.idHisRepre,
      "formaNotifi": editasolicitud.formaNotifi,
      "email": editasolicitud.email


    }
    let keys = JSON.stringify(varios);
    let respuestaHttp = HttpStatusCode.AlreadyReported;
    let basura = HttpErrorResponse.name;
    let urlEdita: string = `${environment.apiUrl}solicitud/editar/${id}`;
    console.log(`DATOS de URL !!! : ${urlEdita}`);
    console.log(`DATOS KEY!!! : ${keys}`)

    return this.http.put<EditarSolicitud>(urlEdita, keys, {headers: this.httpHeaders});

  }

  AsignarA(editasolicitud: EditarSolicitud, id: number): Observable<EditarSolicitud> {
    let idprocedi: number = id;
    let result = JSON.stringify(editasolicitud);


    let varios = {
      "usuario": editasolicitud.usuario,
    }
    let keys = JSON.stringify(varios);
    let respuestaHttp = HttpStatusCode.AlreadyReported;
    let basura = HttpErrorResponse.name;
    let urlEdita: string = `${environment.apiUrl}solicitud/editar/${id}`;

    console.log(`DATOS KEY!!! : ${keys}`)
    return this.http.put<EditarSolicitud>(urlEdita, keys, {headers: this.httpHeaders});
  }


  deleteSolicitud(id: any): Observable<CreaSolicitud> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.router.navigate(['/solicitudes']);
    return this.http.delete<CreaSolicitud>(`${this.urlborrarsolicitud}${id}`, {headers: httpHeaders})
  }

  deleteDocumento(id: any): Observable<DocumentosListar> {
    const httpHeaders = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    this.router.navigate(['/solicitudes']);
    return this.http.delete<DocumentosListar>(`${this.urldocsoliciborrar}${id}`, {headers: httpHeaders})
  }
}

