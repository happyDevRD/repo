import { AtributosCrear } from '../procedimiento';

export interface TipoAtributoOption {
  descripcion: string;
  valor: number;
}

export interface AtributosFormState {
  atributoscrear: AtributosCrear;
  maximoCaracAtributos: number;
  tipocaracteresAtributos: string;
  disabledAtrib: boolean;
}

export const TIPO_ATRIBUTO_OPTIONS: TipoAtributoOption[] = [
  { descripcion: 'Texto (Sin Límite de Caracteres)', valor: 1 },
  { descripcion: 'Texto (1 Carácter)', valor: 2 },
  { descripcion: 'Texto (2 Caracteres Máximo)', valor: 3 },
  { descripcion: 'Texto (3 Caracteres Máximo)', valor: 4 },
  { descripcion: 'Texto (4 Caracteres Máximo)', valor: 5 },
  { descripcion: 'Texto (5 Caracteres Máximo)', valor: 6 },
  { descripcion: 'Texto (6 Caracteres Máximo)', valor: 7 },
  { descripcion: 'Texto (7 Caracteres Máximo)', valor: 8 },
  { descripcion: 'Texto (8 Caracteres Máximo)', valor: 9 },
  { descripcion: 'Texto (9 Caracteres Máximo)', valor: 10 },
  { descripcion: 'Texto (10 Caracteres Máximo)', valor: 11 },
  { descripcion: 'Texto (11 Caracteres Máximo)', valor: 12 },
  { descripcion: 'Texto (12 Caracteres Máximo)', valor: 13 },
  { descripcion: 'Texto (15 Caracteres Máximo)', valor: 14 },
  { descripcion: 'Texto (20 Caracteres Máximo)', valor: 15 },
  { descripcion: 'Texto (50 Caracteres Máximo)', valor: 16 },
  { descripcion: 'Texto (100 Caracteres Máximo)', valor: 17 },
  { descripcion: 'Texto (200 Caracteres Máximo)', valor: 18 },
  { descripcion: 'Texto (500 Caracteres Máximo)', valor: 19 },
  { descripcion: 'Texto (1000 Caracteres Máximo)', valor: 20 },
  { descripcion: 'Fecha Corta (Formato Numérico dd/MM/yyyy)', valor: 21 },
  { descripcion: 'Número (1 Dígito)', valor: 27 },
  { descripcion: 'Número (2 Dígitos Máximo)', valor: 28 },
  { descripcion: 'Número (3 Dígitos Máximo)', valor: 29 },
  { descripcion: 'Número (4 Dígitos Máximo)', valor: 30 },
  { descripcion: 'Número (5 Dígitos Máximo)', valor: 31 },
  { descripcion: 'Número (6 Dígitos Máximo)', valor: 32 },
  { descripcion: 'Número (7 Dígitos Máximo)', valor: 33 },
  { descripcion: 'Número (8 Dígitos Máximo)', valor: 34 },
  { descripcion: 'Número (9 Dígitos Máximo)', valor: 35 },
  { descripcion: 'Número (10 Dígitos Máximo)', valor: 36 },
  { descripcion: 'Número (11 Dígitos Máximo)', valor: 37 },
  { descripcion: 'Número (12 Dígitos Máximo)', valor: 38 },
  { descripcion: 'Moneda (Euro)', valor: 39 },
  { descripcion: 'Coeficiente', valor: 42 },
];

export const applyTipoAtributo = (host: AtributosFormState, valor: number): void => {
  const tipo = TIPO_ATRIBUTO_OPTIONS.find((item) => item.valor === valor);
  if (!tipo) {
    return;
  }
  host.atributoscrear.desGruAtrib = tipo.descripcion;
  host.atributoscrear.etiGruAtrib = tipo.descripcion.split(' ')[0];
  host.disabledAtrib = false;

  if (tipo.descripcion.startsWith('Texto')) {
    const match = tipo.descripcion.match(/(\d+)/);
    host.maximoCaracAtributos = match ? +match[1] : Number.POSITIVE_INFINITY;
    host.tipocaracteresAtributos = 'text';
  } else if (tipo.descripcion.startsWith('Número')) {
    const match = tipo.descripcion.match(/(\d+)/);
    host.maximoCaracAtributos = match ? +match[1] : 1;
    host.tipocaracteresAtributos = 'number';
  } else if (tipo.descripcion.startsWith('Fecha Corta')) {
    host.maximoCaracAtributos = 10;
    host.tipocaracteresAtributos = 'datetime';
    host.disabledAtrib = true;
  } else if (tipo.descripcion.startsWith('Coeficiente') || tipo.descripcion.startsWith('Moneda')) {
    host.maximoCaracAtributos = 10;
    host.tipocaracteresAtributos = 'number';
  } else {
    host.maximoCaracAtributos = Number.POSITIVE_INFINITY;
    host.tipocaracteresAtributos = 'text';
  }
};

export const toggleRequeridoAtributo = (atributoscrear: AtributosCrear, valor: unknown): void => {
  atributoscrear.requerido = valor == atributoscrear.requerido ? 0 : 1;
};
