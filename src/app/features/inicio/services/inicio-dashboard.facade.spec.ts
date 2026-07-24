import { InicioDashboardFacade } from './inicio-dashboard.facade'
import { DashboardCounts } from './inicio-dashboard.service'

describe('InicioDashboardFacade', () => {
  const facade = new InicioDashboardFacade({} as any)

  const counts = (partial: Partial<DashboardCounts>): DashboardCounts => ({
    solicitudes: null,
    expedientes: null,
    tareas: null,
    firmasPendientes: null,
    firmasTerceros: null,
    notificaciones: null,
    ...partial,
  })

  it('totalPendientes suma solo valores numéricos', () => {
    expect(facade.totalPendientes(counts({
      solicitudes: 2,
      expedientes: 3,
      tareas: null,
      firmasPendientes: 1,
    }))).toBe(6)
  })

  it('sectionsWithPending cuenta secciones con valor > 0', () => {
    expect(facade.sectionsWithPending(counts({
      solicitudes: 2,
      expedientes: 0,
      tareas: 1,
      firmasPendientes: null,
    }))).toBe(2)
  })
})
