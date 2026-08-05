const SITUACION_LABELS: Record<number, string> = {
  1: 'GENERADA',
  2: 'ENVIADA',
  3: 'RECEPCIONADA',
  4: 'DEVUELTA',
  5: 'COBRADA',
  6: 'ANULADA',
  7: 'GENERADA',
  8: 'NOTIFICA_ENVIADA',
  9: 'CADUCADA',
};

const BOP_LABELS: Record<number, string> = {
  0: 'N/A',
  1: 'ENVIADO',
  2: 'PUBLICADO',
};

export function situacionLabel(value: number): string {
  return SITUACION_LABELS[value] ?? 'Sin datos';
}

export function bopLabel(value: number): string {
  return BOP_LABELS[value] ?? '';
}
