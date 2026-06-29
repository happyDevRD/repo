import {CUSTOM_ELEMENTS_SCHEMA, NgModule,} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MensajesComponent} from './mensajes/mensajes.component';
import {NavComponent} from './Nav/nav.component';
import {AdministracionComponent} from './administracion/administracion.component';
import {SolicitudesComponent} from './solicitudes/solicitudes.component';
import {ExpedientesComponent} from './expedientes/expedientes.component';
import {LoginComponent} from './login/login.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {appRoutingProviders, routing} from './app.routing';
import {Error404Component} from './error404/error404.component';
import {ProcedimientosComponent} from './procedimientos/procedimientos.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './core/interceptors/auth.interceptor';
import {ExpedientesModule} from './expedientes/expedientes.module';
import {InicioComponent} from './inicio/inicio.component';
import { DashboardGridModalComponent } from './inicio/components/dashboard-grid-modal/dashboard-grid-modal.component';
import { DashboardModalsHostComponent } from './inicio/components/dashboard-modals-host/dashboard-modals-host.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatPaginatorModule} from '@angular/material/paginator';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormnuevoprocediComponent} from './procedimientos/formnuevoprocedi.component';
import {HeadersComponent} from './headers/headers.component';
import {TarCursoComponent} from './inicio/tar-curso.component';
import {PenFirmaComponent} from './inicio/pen-firma.component';
import {MenuInicioComponent} from './inicio/menu-inicio.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatGridListModule} from '@angular/material/grid-list';
import {FormModifProcediComponent} from './procedimientos/form-modif-procedi.component';
import {ModalExpedientesComponent} from './modal/modal-expedientes.component'
import {MatExpansionModule} from '@angular/material/expansion';
import {TareasProcedimientosComponent} from './procedimientos/tarea-procedimiento/tareas-procedimientos.component';
import {MenuprocedimientoComponent} from './procedimientos/menuprocedimiento.component';
import {PermisoprocedimientoComponent} from './procedimientos/permisoprocedimiento.component';
import {VerProcedimientoComponent} from './procedimientos/ver-procedimiento.component';
import {EditaProcedimientoComponent} from './procedimientos/edita-procedimiento.component';
import {MatTableModule} from '@angular/material/table';
import {FilDescripProcediPipe} from './procedimientos/pipe/fil-descrip-procedi.pipe';
import {FilDeparProcediPipe} from './procedimientos/pipe/fil-depar-procedi.pipe';
import {FilSiaProcediPipe} from './procedimientos/pipe/fil-sia-procedi.pipe';
import {FilasuntoPipe} from './solicitudes/pipe/filasunto.pipe';
import {FilinteresadoPipe} from './solicitudes/pipe/filinteresado.pipe';
import {FilrepresentantePipe} from './solicitudes/pipe/filrepresentante.pipe';
import {FildepartamentoPipe} from './solicitudes/pipe/fildepartamento.pipe';
import {FilasignadoPipe} from './solicitudes/pipe/filasignado.pipe';
import {FilestadoPipe} from './solicitudes/pipe/filestado.pipe';
import {FilejercicioPipe} from './expedientes/pipe/filejercicio.pipe';
import {FilexpedientePipe} from './expedientes/pipe/filexpediente.pipe';
import {FiltituloPipe} from './expedientes/pipe/filtitulo.pipe';
import {FilfaperturaPipe} from './expedientes/pipe/filfapertura.pipe';
import {FilprocedimientoPipe} from './expedientes/pipe/filprocedimiento.pipe';
import {FilinstructorokPipe} from './expedientes/pipe/filinstructorok.pipe';
import {FiltramitadorPipe} from './inicio/pipe/filtramitador.pipe';
import {EditaExpedienteComponent} from './expedientes/edita-expediente.component';
import {jqxGridModule} from 'jqwidgets-ng/jqxgrid';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {FiltroComponent} from './filtro/filtro.component';
import {MatSelectModule} from '@angular/material/select';
import {InteresadoComponent} from './expedientes/interesado/interesado.component';
import {FooterComponent} from './footer/footer.component';
import {AppShellComponent} from './layout/app-shell.component';
import {AccessDeniedComponent} from './shared/access-denied/access-denied.component';
import {SslComponent} from './login/ssl/ssl.component';
import {RecibosPendientesComponent} from './procedimientos/recibos-pendientes/recibos-pendientes.component';
import {LiquidacionFormComponent} from './features/liquidacion/components/liquidacion-form/liquidacion-form.component';
import {GenerarEntradaComponent} from './features/generar-entrada/generar-entrada.component';
import { OperacionFormComponent } from './features/operacion-form/operacion-form.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { ModificarDatosPersonaComponent } from './features/modificar-datos-persona/modificar-datos-persona.component';
import { BajaHabitanteComponent } from './features/baja-habitante/baja-habitante.component';
import { CalculadoraIvaComponent } from './features/calculadora-iva/calculadora-iva.component';
import {NgxCurrencyDirective} from "ngx-currency";


@NgModule({
  declarations: [

    AppComponent,
    MensajesComponent,
    NavComponent,
    AdministracionComponent,
    SolicitudesComponent,
    ExpedientesComponent,
    LoginComponent,
    Error404Component,
    ProcedimientosComponent,
    InicioComponent,
    DashboardGridModalComponent,
    DashboardModalsHostComponent,
    FormnuevoprocediComponent,
    HeadersComponent,
    TarCursoComponent,
    PenFirmaComponent,
    MenuInicioComponent,
    FormModifProcediComponent,
    ModalExpedientesComponent,
    TareasProcedimientosComponent,
    MenuprocedimientoComponent,
    PermisoprocedimientoComponent,
    VerProcedimientoComponent,
    EditaProcedimientoComponent,
    FilDescripProcediPipe,
    FilDeparProcediPipe,
    FilSiaProcediPipe,
    FilasuntoPipe,
    FilinteresadoPipe,
    FilrepresentantePipe,
    FildepartamentoPipe,
    FilasignadoPipe,
    FilestadoPipe,
    FilejercicioPipe,
    FilexpedientePipe,
    FiltituloPipe,
    FilfaperturaPipe,
    FilprocedimientoPipe,
    FilinstructorokPipe,
    FiltramitadorPipe,
    EditaExpedienteComponent,
    FiltroComponent,
    InteresadoComponent,
    FooterComponent,
    SslComponent,
    RecibosPendientesComponent,
    LiquidacionFormComponent,
    GenerarEntradaComponent,
    OperacionFormComponent,
    ModificarDatosPersonaComponent,
    BajaHabitanteComponent,
    CalculadoraIvaComponent,
    AppShellComponent,
    AccessDeniedComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxPaginationModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatGridListModule,
    MatDatepickerModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatStepperModule,
    MatExpansionModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
    HttpClientModule,
    ExpedientesModule,
    MatButtonModule,
    MatFormFieldModule,
    routing,
    jqxGridModule,
    PdfViewerModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    NgxCurrencyDirective
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    appRoutingProviders,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
