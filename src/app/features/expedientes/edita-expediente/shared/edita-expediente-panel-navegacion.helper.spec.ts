import { setTituloPanelTramite } from './edita-expediente-panel-navegacion.helper'

describe('edita-expediente-panel-navegacion.helper', () => {
  it('setTituloPanelTramite escribe textContent (no innerHTML)', () => {
    const el = document.createElement('div')
    el.id = 'tramite'
    document.body.appendChild(el)

    setTituloPanelTramite('<script>alert(1)</script>Trámite')

    expect(el.textContent).toBe('<script>alert(1)</script>Trámite')
    expect(el.innerHTML).toBe('&lt;script&gt;alert(1)&lt;/script&gt;Trámite')

    document.body.removeChild(el)
  })
})
