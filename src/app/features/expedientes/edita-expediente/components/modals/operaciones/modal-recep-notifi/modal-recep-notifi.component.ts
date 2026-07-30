import { Component, HostListener, inject } from '@angular/core'
import { FormBuilder, Validators } from '@angular/forms'
import { EditaExpedienteComponent } from '../../../../edita-expediente.component'
import { EditaExpedienteNotificacionesUiFacade } from '../../../../notificaciones/edita-expediente-notificaciones-ui.facade'

import {
  trackByReceptor,
} from '../../../../../../../core/helper/track-by.helper'

const RECEP_NOTIFI_MODAL_ID = 'RecepNotifi'

/** `creanotificacion.fecRecNotif` admite `Date | string | null` (modelo compartido); el input date solo acepta `YYYY-MM-DD`. */
function toDateInputValue(value: Date | string | null | undefined): string {
  if (!value) {
    return ''
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10)
  }
  return String(value).slice(0, 10)
}

@Component({
  selector: 'app-edita-modal-recep-notifi',
  templateUrl: './modal-recep-notifi.component.html',
})
export class EditaModalRecepNotifiComponent {
  readonly edita = inject(EditaExpedienteComponent)
  readonly notif = inject(EditaExpedienteNotificacionesUiFacade)
  readonly trackByReceptor = trackByReceptor

  private readonly fb = inject(FormBuilder)

  /** Form local: refleja `notif.creanotificacion` al abrir y se vuelca a él al guardar (R4/R5 se gestionan fuera, en el estado compartido). */
  readonly form = this.fb.group({
    fecRecNotif: ['', Validators.required],
    receptor: [null as number | string | null, Validators.required],
  })

  @HostListener('document:shown.bs.modal', ['$event'])
  handleModalShown(event: Event): void {
    const target = event.target as HTMLElement | null
    if (target?.id !== RECEP_NOTIFI_MODAL_ID) {
      return
    }
    this.form.reset({
      fecRecNotif: toDateInputValue(this.notif.creanotificacion.fecRecNotif),
      receptor: this.notif.creanotificacion.receptor ?? null,
    })
  }

  get fecRecNotifInvalid(): boolean {
    const control = this.form.controls.fecRecNotif
    return control.invalid && (control.touched || control.dirty)
  }

  get receptorInvalid(): boolean {
    const control = this.form.controls.receptor
    return control.invalid && (control.touched || control.dirty)
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }
    const { fecRecNotif, receptor } = this.form.getRawValue()
    this.notif.creanotificacion.fecRecNotif = fecRecNotif
    this.notif.creanotificacion.receptor = receptor as number
    this.notif.recepcionarNotificacion()
  }

  handleCancelar(): void {
    this.notif.borraDatosRecepcion()
    this.edita.cerrarModal(RECEP_NOTIFI_MODAL_ID)
  }
}
