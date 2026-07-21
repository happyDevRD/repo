export const formatIsoDateToDisplay = (iso?: string | null, fallback = ''): string => {
  if (!iso) {
    return fallback;
  }
  const dia = iso.substring(8, 10);
  const mes = iso.substring(5, 7);
  const anio = iso.substring(0, 4);
  return `${dia}/${mes}/${anio}`;
};

export const formatIsoDateToGridCell = (value?: string | null): string => {
  if (!value) {
    return '<div style="text-align: center; color:red;margin-top: 5px;"  type="button"  >Sin fecha registrada</div>';
  }
  const dia = value.substring(8, 10);
  const mes = value.substring(5, 7);
  const anio = value.substring(0, 4);
  return `<div style="text-align: center; margin-top: 5px;"  type="button"  >${dia}-${mes}-${anio}</div>`;
};
