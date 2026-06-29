const PAGE_TITLES: Array<{ match: RegExp; title: string }> = [
  { match: /^\/inicio$/, title: 'Inicio' },
  { match: /^\/mensajes$/, title: 'Mensajes' },
  { match: /^\/solicitudes$/, title: 'Solicitudes' },
  { match: /^\/expedientes$/, title: 'Expedientes' },
  { match: /^\/procedimientos$/, title: 'Procedimientos' },
  { match: /^\/administracion$/, title: 'Administración' },
  { match: /^\/nprocedimiento/, title: 'Nuevo procedimiento' },
  { match: /^\/verprocedi\//, title: 'Ver procedimiento' },
  { match: /^\/tareasprocedimientos$/, title: 'Tareas de procedimientos' },
  { match: /^\/tarcurso$/, title: 'Tareas en curso' },
  { match: /^\/penfirma$/, title: 'Pendientes de firma' },
  { match: /^\/menuinicio$/, title: 'Menú inicio' },
  { match: /^\/modifprocedimiento$/, title: 'Modificar procedimiento' },
  { match: /^\/editaprocedimiento\//, title: 'Editar procedimiento' },
  { match: /^\/editaexpediente\//, title: 'Editar expediente' },
  { match: /^\/interesado\//, title: 'Interesado' },
  { match: /^\/permisoprocedimiento$/, title: 'Permisos de procedimiento' },
];

export function resolvePageTitle(url: string): string {
  const path = url.split('?')[0].split('#')[0];
  const entry = PAGE_TITLES.find(item => item.match.test(path));
  return entry?.title ?? '';
}
