export class FirmaListar {
  idProFirma!: number;
  tipFirma!: number;
  modulo!: number;
  conDesat!: boolean;
  activo!: boolean;
  descripcionCircuito!: string;
  usuContr!: unknown;
  fecContr!: unknown;
  codEntid!: number;
  plantilla!: string;
  procesoFirmadoDefecto!: number;
}

export type ProcedimientoWorkspaceTab = 'datos' | 'tareas' | 'permisos' | 'atributos';

export const PROCEDIMIENTO_WORKSPACE_TABS: ProcedimientoWorkspaceTab[] = [
  'datos',
  'tareas',
  'permisos',
  'atributos',
];

export const MODALIDAD_LABELS: Record<number, string> = {
  1: 'Presencial',
  2: 'Web con certificado',
  3: 'Web sin certificado',
  4: 'Presencial y Web con certificado',
  5: 'Presencial y Web sin certificado',
};

export const MATERIA_LABELS: Record<number, string> = {
  1: 'SIN MATERIA',
  2: 'RECAUDACIÓN',
  3: 'URBANISMO',
};
