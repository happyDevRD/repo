import { Injectable } from '@angular/core';

/** Claves de sesión usadas tras el login y navegación entre módulos. */
export const SESSION_KEYS = {
  token: 'token',
  user: 'user',
  departamento: 'departamento',
  idOrgan: 'idOrgan',
  idOrgEleme: 'idOrgEleme',
  idOrgUsuar: 'idOrgUsuar',
  nivAcces: 'nivAcces',
  solUsuar: 'solUsuar',
  traUsuar: 'traUsuar',
  mensRecibido: 'MensRecibido',
  mensajesRecibidos: 'MensajesRecibidos',
  mensajesTramitados: 'nmensajestramitados',
  idProcedimiento: 'idprocedimiento',
  idPermiso: 'idpermiso',
  idExpediente: 'idexpediente',
  usuarioTarea: 'usuarioTarea',
  asuntoModal: 'asuntoModal',
  descripTarea: 'descripTarea',
  ruta: 'ruta',
} as const;

export interface LoginSessionPayload {
  idOrgan: string;
  idOrgEleme: string;
  departamento: string;
  token: string;
  user: string;
  nivAcces: string;
  solUsuar: string;
  traUsuar: string;
  idOrgUsuar: string;
}

@Injectable({ providedIn: 'root' })
export class UserSessionService {

  get token(): string | null {
    return this.getItem(SESSION_KEYS.token);
  }

  get user(): string | null {
    return this.getItem(SESSION_KEYS.user);
  }

  get department(): string | null {
    return this.getItem(SESSION_KEYS.departamento);
  }

  get idOrgan(): string | null {
    return this.getItem(SESSION_KEYS.idOrgan);
  }

  get idOrgEleme(): string | null {
    return this.getItem(SESSION_KEYS.idOrgEleme);
  }

  get idOrgUsuar(): string | null {
    return this.getItem(SESSION_KEYS.idOrgUsuar);
  }

  get nivAcces(): string | null {
    return this.getItem(SESSION_KEYS.nivAcces);
  }

  get solUsuar(): string | null {
    return this.getItem(SESSION_KEYS.solUsuar);
  }

  get traUsuar(): string | null {
    return this.getItem(SESSION_KEYS.traUsuar);
  }

  get mensRecibido(): string | null {
    return this.getItem(SESSION_KEYS.mensRecibido);
  }

  get mensajesRecibidosCount(): string | null {
    return this.getItem(SESSION_KEYS.mensajesRecibidos);
  }

  get idProcedimiento(): string | null {
    return this.getItem(SESSION_KEYS.idProcedimiento);
  }

  get idPermiso(): string | null {
    return this.getItem(SESSION_KEYS.idPermiso);
  }

  get idExpediente(): string | null {
    return this.getItem(SESSION_KEYS.idExpediente);
  }

  get asuntoModal(): string | null {
    return sessionStorage.getItem(SESSION_KEYS.asuntoModal);
  }

  get ruta(): string | null {
    return sessionStorage.getItem(SESSION_KEYS.ruta);
  }

  get isAuthenticated(): boolean {
    return !!this.token;
  }

  get canManageSolicitudes(): boolean {
    return this.solUsuar === '1';
  }

  get canManageExpedientes(): boolean {
    return this.traUsuar === '1';
  }

  /** Acceso al módulo de procedimientos (nivel 6). */
  get canManageProcedimientos(): boolean {
    return this.nivAcces === '6';
  }

  /** Lee de sessionStorage con fallback a localStorage (compat. login legacy). */
  private getItem(key: string): string | null {
    return sessionStorage.getItem(key) || localStorage.getItem(key);
  }

  persistLogin(payload: LoginSessionPayload): void {
    localStorage.setItem(SESSION_KEYS.user, payload.user);
    localStorage.setItem(SESSION_KEYS.nivAcces, payload.nivAcces);
    localStorage.setItem(SESSION_KEYS.token, payload.token);

    sessionStorage.setItem(SESSION_KEYS.idOrgan, payload.idOrgan);
    sessionStorage.setItem(SESSION_KEYS.idOrgEleme, payload.idOrgEleme);
    sessionStorage.setItem(SESSION_KEYS.departamento, payload.departamento);
    sessionStorage.setItem(SESSION_KEYS.token, payload.token);
    sessionStorage.setItem(SESSION_KEYS.user, payload.user);
    sessionStorage.setItem(SESSION_KEYS.nivAcces, payload.nivAcces);
    sessionStorage.setItem(SESSION_KEYS.solUsuar, payload.solUsuar);
    sessionStorage.setItem(SESSION_KEYS.traUsuar, payload.traUsuar);
    sessionStorage.setItem(SESSION_KEYS.idOrgUsuar, payload.idOrgUsuar);
  }

  setMensRecibido(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.mensRecibido, value);
  }

  setMensajesRecibidosCount(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.mensajesRecibidos, value);
  }

  setMensajesTramitadosCount(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.mensajesTramitados, value);
  }

  setIdProcedimiento(value: string | number): void {
    sessionStorage.setItem(SESSION_KEYS.idProcedimiento, String(value));
  }

  setIdPermiso(value: string | number): void {
    sessionStorage.setItem(SESSION_KEYS.idPermiso, String(value));
  }

  setUsuarioTarea(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.usuarioTarea, value);
  }

  setIdExpediente(value: string | number): void {
    sessionStorage.setItem(SESSION_KEYS.idExpediente, String(value));
  }

  setAsuntoModal(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.asuntoModal, value);
  }

  setDescripTarea(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.descripTarea, value);
  }

  setRuta(value: string): void {
    sessionStorage.setItem(SESSION_KEYS.ruta, value);
  }

  clear(): void {
    sessionStorage.clear();
    localStorage.removeItem(SESSION_KEYS.token);
    localStorage.removeItem(SESSION_KEYS.user);
    localStorage.removeItem(SESSION_KEYS.nivAcces);
  }
}
