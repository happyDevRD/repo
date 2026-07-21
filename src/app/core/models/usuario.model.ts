/** Modelo de usuario de sesión / login. */
export class Usuario {
  id!: number;
  usuario!: string;
  numUsuar!: number;
  idHisPerso!: number;
  idOrgEleme!: number;
  password!: string;
  departamento!: string;
  solUsuar!: number;
  traUsuar!: number;
  nivAcces!: number;
  token!: string;
  idOrgUsuar!: string;
}

export type UsuarioDto = Usuario;
