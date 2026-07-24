import { Component, OnInit } from '@angular/core';
import {
  CreaPermisoProcedi,
  CreaTareaProcedi,
  EditarProcedi,
  EditaTareaProcedi,
  PlantillaTarea,
  Procedimiento,
  ProcediPermisos,
  ProcesoFirmadoListar,
  UsuariosListar
} from './procedimiento';
import { ActivatedRoute } from '@angular/router';
import { jqxGrid_ES } from 'src/translations/jqxGrid_translate';
import { IflowGridLocalization, IflowGridSource } from 'src/app/shared/components/iflow-grid/iflow-grid.component';
import { UserSessionService } from '../../core/service/user-session.service';
import { PermisoProcediCreado, TareaProcediCreada } from './models/procedimientos-internal.models';
import {
  EditaProcedimientoProcedimientoFacade,
} from './edita-procedimiento/edita-procedimiento-procedimiento.facade';
import { EditaProcedimientoTareasFacade } from './edita-procedimiento/edita-procedimiento-tareas.facade';
import { EditaProcedimientoPermisosFacade } from './edita-procedimiento/edita-procedimiento-permisos.facade';

@Component({
  selector: 'app-edita-procedimiento',
  templateUrl: './edita-procedimiento.component.html',
  styleUrls: ['./edita-procedimiento.component.css'],
  providers: [
    EditaProcedimientoProcedimientoFacade,
    EditaProcedimientoTareasFacade,
    EditaProcedimientoPermisosFacade,
  ],
})
export class EditaProcedimientoComponent implements OnInit {

  public edicion: boolean = false;
  public vermenu: boolean = false; // para ver el menu tiene que cambiar a true
  public idProcedimiento!: number;

  public procedimiento: Procedimiento = new Procedimiento();
  public editarprocedi: EditarProcedi = new EditarProcedi();
  public editatareaprocedi: any = new EditaTareaProcedi();
  public creatareaprocedi: CreaTareaProcedi = new CreaTareaProcedi();
  public creapermisoprocedi: CreaPermisoProcedi = new CreaPermisoProcedi();

  public plantillatarea: PlantillaTarea[] = [];
  public procedipermiso: ProcediPermisos[] = [];
  public usuarioslistar: UsuariosListar[] = [];
  public firmalistar: ProcesoFirmadoListar[] = [];

  public tareaprocedicreada: TareaProcediCreada | CreaTareaProcedi = new TareaProcediCreada();
  public permisoprocedicreado: PermisoProcediCreado | CreaPermisoProcedi = new PermisoProcediCreado();

  public idverTarea!: number;
  public idPermisoProcedimiento!: number;
  public idtrigger: any;

  public usuarioTarea: any;
  public usuarioTareaDescrip: any;

  public veoBorrarTarea: boolean = false;
  public activoFormNuevoPermiso: boolean = false;
  public botonNuevoPermiso: boolean = true;

  public localizationObject: IflowGridLocalization = jqxGrid_ES;
  public source: IflowGridSource;
  public sourcePermi: IflowGridSource;

  get idpro(): string | null {
    return this.session.idProcedimiento;
  }

  get idpermis(): string | null {
    return this.session.idPermiso;
  }

  get userctrl(): string | null {
    return this.session.user;
  }

  constructor(
    public activatedRoute: ActivatedRoute,
    public session: UserSessionService,
    private readonly procedimientoFacade: EditaProcedimientoProcedimientoFacade,
    private readonly tareasFacade: EditaProcedimientoTareasFacade,
    private readonly permisosFacade: EditaProcedimientoPermisosFacade,
  ) {
    this.tareasFacade.initSource(this);
    this.permisosFacade.lanzaSourcePermi(this, this.idpermis ?? '');
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.idProcedimiento = Number(params['id']);
      this.procedimientoFacade.cargarProcedimiento(this, this.idProcedimiento);
    });

    this.procedimientoFacade.cargarDatosIniciales(this);
  }

  public cambiamosDOM(): void {
    this.vermenu = false;
    this.usuarioTarea = '';
  }

  public editaProcedi(id: number): void {
    this.procedimientoFacade.editar(this, id);
  }

  // -------------------- TAREAS --------------------

  public peparadatosfirma(plantilla: string): void {
    this.tareasFacade.prepararDatosFirma(this, plantilla);
  }

  public createTareaProcedi(procedimientoId: number): void {
    this.tareasFacade.crear(this, procedimientoId);
  }

  public editaTareaProcedim(): void {
    this.tareasFacade.editar(this);
  }

  public deleteTareaProcedimiento(): void {
    this.tareasFacade.eliminar(this, this.idPermisoProcedimiento);
  }

  public envioid(event: any): void {
    const rowData = event.args.row.bounddata;

    this.usuarioTarea = '';
    this.filtraUsuarios();
    this.vermenu = true;
    this.sourcePermi = '';
    this.veoBorrarTarea = false;

    this.idPermisoProcedimiento = rowData.id;
    this.idverTarea = rowData.id;
    this.idtrigger = rowData.id;

    this.editatareaprocedi = {
      descripcion: rowData.descripcion || '',
      faseTarea: rowData.faseTarea || '',
      plazo: rowData.plazo || null,
      tipoPlazo: rowData.tipoPlazo || '',
      plantillaDefecto: rowData.plantillaDefecto || '',
      firmaPorDefecto: rowData.firmaPorDefecto || null,
      plantillaDefectoModulo: rowData.plantillaDefectoModulo || null,
      acciones: rowData.acciones || '',
    };

    if (rowData.plantillaDefecto) {
      this.peparadatosfirma(rowData.plantillaDefecto);
    }

    this.session.setIdPermiso(rowData.id);
    this.edicion = !!this.idverTarea;
    this.vermenu = !!this.idverTarea;

    this.permisosFacade.lanzaSourcePermi(this, rowData.id);
  }

  // -------------------- PERMISOS --------------------

  public activaFormNuevoPermiso(): void {
    this.botonNuevoPermiso = false;
    this.activoFormNuevoPermiso = true;
    this.veoBorrarTarea = false;
  }

  public atrasCrearPermisoProcedi(): void {
    this.activoFormNuevoPermiso = false;
    this.botonNuevoPermiso = true;
  }

  public createPermisoProcedi(): void {
    this.permisosFacade.crear(this, this.idtrigger);
  }

  public deletePermisoProcedimiento(): void {
    this.permisosFacade.eliminar(this, this.idPermisoProcedimiento, this.usuarioTarea, this.idtrigger);
  }

  public idpermisosPermi(event: any): void {
    this.veoBorrarTarea = true;
    this.usuarioTarea = event.args.row.bounddata.usuario;
    this.idPermisoProcedimiento = event.args.row.bounddata.id;
    this.filtraUsuarios();
    setTimeout(() => this.tempoVerBorrarTarea(), 3500);
  }

  private tempoVerBorrarTarea(): void {
    this.veoBorrarTarea = false;
  }

  public filtraUsuarios(): void {
    for (let index = 0; index < this.usuarioslistar.length; index++) {
      if (this.usuarioTarea == null) {
        this.usuarioTarea = 'Pulsa sobre el usuario para obtener datos';
      }
      if (this.usuarioTarea == this.usuarioslistar[index].usuario || this.usuarioTarea == this.userctrl) {
        this.usuarioTareaDescrip = this.usuarioslistar[index].desUsuario;
      }
    }
  }

  // -------------------- GRID: TAREAS DEL PROCEDIMIENTO --------------------

  public columnrenderer = function (value) {
    return '<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">' + value + '</div>';
  }

  public columnrendererSelecTarea = function (value) {
    return ' <div style="padding-top:5px;  text-align: center;"  type="button" title="Selecciona Tarea"  ><input type="radio"  value="" name="RadioId" id="RadioId">   </div>';
  }

  public cellsrenderer = (row, column, value) => {
    if (value == 'ANOS') {
      value = 'AÑOS';
    }
    if (value <= 0 || value == 'SINPLAZO') {
      value = 'SIN PLAZO';
      return '<div style="color:red;  text-align: center; font-family: Verdana; margin-top: 5px;"  data-bs-toggle="modal" data-bs-target="#modifitareasModal" data-bs-whatever="@mdo">' + value + '</div>';
    }
    return '<div style="  text-align: center;font-family: Verdana; margin-top: 5px;"  data-bs-toggle="modal" data-bs-target="#modifitareasModal" data-bs-whatever="@mdo">' + value + '</div>';
  }

  columns = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'plantillaDefecto', datafield: 'plantillaDefecto', width: '1%', hidden: true },
    { text: '', datafield: '', width: '5%', cellsrenderer: this.columnrendererSelecTarea, renderer: this.columnrenderer },
    { text: 'Descripción', datafield: 'descripcion', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    { text: 'Fase', datafield: 'faseTarea', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    { text: 'Plazo', datafield: 'plazo', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
    { text: 'Tipo plazo', datafield: 'tipoPlazo', cellsrenderer: this.cellsrenderer, renderer: this.columnrenderer },
  ];

  // -------------------- GRID: PERMISOS --------------------

  public columnrendererPermi = function (value) {
    return '<div style="text-align: center; font-weight: bold; font-family: Verdana; margin-top: 5px;">' + value + '</div>';
  }

  public cellsrendererPermi = (row, column, value) => {
    if (value == 'ANOS') {
      value = 'AÑOS';
    }
    return '<div style="text-align: center;font-family: Verdana; margin-top: 5px;"  >' + value + '</div>';
  }

  columnsPermi = [
    { text: 'id', datafield: 'id', width: '1%', hidden: true },
    { text: 'Usuario', datafield: 'usuario', cellsrenderer: this.cellsrendererPermi, renderer: this.columnrendererPermi },
    {
      text: 'Procedimiento',
      datafield: 'desProce',
      cellsrenderer: this.cellsrendererPermi,
      renderer: this.columnrenderer,
      hidden: true
    },
    { text: 'Descripción', datafield: 'descripcion', renderer: this.columnrenderer, hidden: true },
    { text: 'Tarea', datafield: 'desTareaProce', cellsrenderer: this.cellsrendererPermi, renderer: this.columnrenderer },
  ];
}
