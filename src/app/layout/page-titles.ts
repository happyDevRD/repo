const PAGE_TITLES: Array<{ match: RegExp; title: string }> = [
  { match: /^\/inicio$/, title: 'Inicio' },
  { match: /^\/mensajes$/, title: 'Mensajes' },
  { match: /^\/solicitudes$/, title: 'Solicitudes' },
  { match: /^\/expedientes$/, title: 'Expedientes' },
  { match: /^\/procedimientos$/, title: 'Procedimientos' },
  { match: /^\/procedimientos\//, title: 'Procedimiento' },
  { match: /^\/administracion$/, title: 'Administración' },
  { match: /^\/tarcurso$/, title: 'Tareas en curso' },
  { match: /^\/penfirma$/, title: 'Pendientes de firma' },
  { match: /^\/menuinicio$/, title: 'Menú inicio' },
  { match: /^\/editaexpediente\//, title: 'Editar expediente' },
  { match: /^\/interesado\//, title: 'Interesado' },
];

export function resolvePageTitle(url: string): string {
  const path = url.split('?')[0].split('#')[0];
  const entry = PAGE_TITLES.find(item => item.match.test(path));
  return entry?.title ?? '';
}
