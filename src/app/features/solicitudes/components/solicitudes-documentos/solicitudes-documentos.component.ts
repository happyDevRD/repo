import { Component, inject } from '@angular/core'
import { DocumentosListar } from '../../models'
import { SolicitudesComponent } from '../../solicitudes.component'
import { SolicitudesDocumentosFacade } from '../../services/solicitudes-documentos.facade'

@Component({
  selector: 'app-solicitudes-documentos',
  templateUrl: './solicitudes-documentos.component.html',
})
export class SolicitudesDocumentosComponent {
  readonly s = inject(SolicitudesComponent)
  private readonly documentosFacade = inject(SolicitudesDocumentosFacade)

  trackByDocId(_index: number, doc: DocumentosListar): number {
    return doc.id
  }

  iconoDocumento(nombreArchivo: string | null | undefined): string {
    return this.documentosFacade.iconoDocumento(nombreArchivo)
  }

  formatearFecha(fecha: string | null | undefined): string {
    return this.documentosFacade.formatearFecha(fecha)
  }

  handleNuevoDocumento(): void {
    this.s.abrirModal('documentoModal')
  }

  handleAbrirDocumento(doc: DocumentosListar): void {
    this.documentosFacade.abrirDocumento(this.s, doc)
  }

  handleDescargarDocumento(doc: DocumentosListar): void {
    this.documentosFacade.seleccionarDocumento(this.s, doc)
    this.s.abreArchivo(this.s.descargafichero)
  }

  handleEliminarDocumento(doc: DocumentosListar): void {
    this.documentosFacade.seleccionarDocumento(this.s, doc)
    this.s.deleteDocumento(doc.id)
  }
}
