import {
  buildIdentificadorExpedienteEni,
  buildIdentificadorDocumentoEni,
  filtrarTareasFinalizadasConDocumento,
  mapDocumentacionToEstadoElaboracion,
} from './inside-iflow.mapper'
import {
  esExpedienteCerrado,
  esTareaFinalizada,
  validarExpedienteParaInside,
} from './inside-validation.helper'
import { InsideIflowContext } from './inside-iflow.context.models'
import { TareaTramiteExpporExpedi, VerExpediente } from '../../../expedientes/expedientes'

describe('inside-iflow.mapper', () => {
  it('buildIdentificadorExpedienteEni genera formato ENI esperado', () => {
    expect(buildIdentificadorExpedienteEni('L12345678', 2026, 42)).toBe('ES_L12345678_2026_EXP_0000042')
  })

  it('buildIdentificadorDocumentoEni genera secuencia con padding', () => {
    expect(buildIdentificadorDocumentoEni('L12345678', 2026, 3)).toBe('ES_L12345678_2026_0000003')
  })

  it('mapDocumentacionToEstadoElaboracion devuelve EE01 para original', () => {
    expect(mapDocumentacionToEstadoElaboracion(1)).toBe('EE01')
  })

  it('filtrarTareasFinalizadasConDocumento exige fecFin', () => {
    const tareas = [
      { id: 1, archivo: 10, fecFin: '2026-01-01', numero: 1, tramite: 1 } as unknown as TareaTramiteExpporExpedi,
      { id: 2, archivo: 11, fecFin: null, numero: 2, tramite: 1 } as unknown as TareaTramiteExpporExpedi,
    ]

    expect(filtrarTareasFinalizadasConDocumento(tareas).length).toBe(1)
  })
})

describe('inside-validation.helper', () => {
  const contextBase = (): InsideIflowContext => ({
    expediente: {
      id: 1,
      ejercicio: 2026,
      numero: 10,
      estado: 'ABIERTO',
    } as VerExpediente,
    tareas: [
      { id: 1, archivo: 100, fecFin: '2026-01-01', numero: 1, tramite: 1 } as unknown as TareaTramiteExpporExpedi,
    ],
    interesados: [{ numDocumInter: '12345678A' } as never],
    indiceEni: [],
    atributos: [],
  })

  it('esExpedienteCerrado detecta CERRADO y ARCHIVADO', () => {
    expect(esExpedienteCerrado({ estado: 'CERRADO' } as VerExpediente)).toBeTrue()
    expect(esExpedienteCerrado({ estado: 'ABIERTO' } as VerExpediente)).toBeFalse()
  })

  it('esTareaFinalizada requiere fecFin', () => {
    expect(esTareaFinalizada({ fecFin: '2026-01-01' } as unknown as TareaTramiteExpporExpedi)).toBeTrue()
    expect(esTareaFinalizada({ fecFin: null } as unknown as TareaTramiteExpporExpedi)).toBeFalse()
  })

  it('validarExpedienteParaInside falla si requiere cerrado y está abierto', () => {
    const validacion = validarExpedienteParaInside(contextBase(), { requiereCerrado: true })
    expect(validacion.valido).toBeFalse()
    expect(validacion.errores.some((item) => item.codigo === 'EXP_NO_CERRADO')).toBeTrue()
  })

  it('validarExpedienteParaInside es válido con documentos e interesados', () => {
    const validacion = validarExpedienteParaInside(contextBase())
    expect(validacion.valido).toBeTrue()
    expect(validacion.documentosConvertibles).toBe(1)
  })
})
