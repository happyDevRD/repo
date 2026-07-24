import {CrearProcedi, EditarProcedi, Procedimiento} from './procedimiento';


export const PROCEDIMIENTOS: Procedimiento[] = [
  {id: 1, descripcion: '', departamento: '', codigoSia: ''}
];

export const CREARPROCEDI: CrearProcedi[] = [
  {
    id: 0,
    descripcion: '',
    depart: '',
    siglas: '',
    departamento: [
      {
        idOrgEleme: '',
        idOrgan: '',
        cadEleme: '',
        desEleme: '',
        accesible: '',
        organo: '',
        usuContr: '',
        idOrgElePadre: '',
        fecContr: ''
      }],
    codigoSia: ''
    , usuContr: '',
    modalidad: 0,
    materia: 0
  }
];


export const EDITARPROCEDI: EditarProcedi[] = [
  {
    id: 0,
    descripcion: '',
    departamento: [
      {
        idOrgEleme: '',
        idOrgan: '',
        cadEleme: '',
        desEleme: '',
        accesible: '',
        organo: '',
        usuContr: '',
        idOrgElePadre: '',
        fecContr: ''
      }],
    codigoSia: ''
    , usuContr: '',
    modalidad: 0,
    materia: 0
  }
];


