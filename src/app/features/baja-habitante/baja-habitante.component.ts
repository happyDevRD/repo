import { Component, Input, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { PROVIN, MUNICIO, TIPO_BAJA } from '../../core/constants/datos';
import { BajaHabitantes } from '../../core/models/baja-habitantes.model';
import { PersonaEntidad } from '../../core/models/personaentidad.model';
import { Pais } from '../../core/models/pais.model';
import { ExpedientesService } from '../../expedientes/expedientes.service';

@Component({
  selector: 'app-baja-habitante',
  templateUrl: './baja-habitante.component.html',
  styleUrls: ['./baja-habitante.component.css']
})
export class BajaHabitanteComponent implements OnInit {
  // Se recibe el número de documento para identificar a la persona
  @Input() documento: string;

  // La persona se obtiene internamente
  public persona: PersonaEntidad;

  // De instancia internamente el objeto de baja
  public bajaHabitantes: BajaHabitantes = new BajaHabitantes();

  // Importamos las constantes directamente
  public provin = PROVIN;
  public municio = MUNICIO;
  public TipoBaja = TIPO_BAJA;

  // Lista filtrada de municipios para el select de la baja
  public municiflitro: any[] = [];
  // Variables para controlar la habilitación de algunos selects
  public disablePais = false;
  public disableMunicipio = false;
  // Lista de países (se obtiene mediante el servicio)
  public pais: Pais[] = [];

  constructor(private expedientesService: ExpedientesService) {}

  ngOnInit(): void {
    if (!this.documento) {
      Swal.fire("No se proporcionó el documento de la persona.");
      return;
    }
    // Obtiene la persona usando el documento
    this.expedientesService.getPersonaEntidad(this.documento).subscribe({
      next: (respuesta) => {
        this.persona = respuesta;
        // Después de obtener la persona, se obtienen los países
        this.expedientesService.getPaises().subscribe({
          next: (paises) => {
            this.pais = paises;
          },
          error: (err) => {
            console.error("Error al obtener países:", err);
          }
        });
      },
      error: (error) => {
        Swal.fire(error.error.message || "Error al obtener los datos de la persona.");
      }
    });
  }

  // Filtra la lista de municipios según la provincia seleccionada en bajaHabitantes.proProDesti
  public gestimunicip(provId: any): void {
    if (!this.municio || !Array.isArray(this.municio)) {
      console.error("La lista de municipios no está definida o no es un arreglo");
      this.municiflitro = [];
      return;
    }
    this.municiflitro = this.municio.filter(municipio =>
      String(municipio.id).substring(0, 2) === String(provId)
    );
  }

  // Ajusta la interfaz según el tipo de baja seleccionado
  public AccionTipoBaja(): void {
    switch (this.bajaHabitantes.tipBaja) {
      case "1": // Documentación Física Requerida (ej: fallecimiento)
        this.disablePais = false;
        this.disableMunicipio = true;
        this.bajaHabitantes.paiProDesti = "108";
        break;
      case "2": // Indebido
        this.disablePais = true;
        this.disableMunicipio = true;
        this.bajaHabitantes.paiProDesti = "";
        break;
      case "3": // Duplicado
        this.disablePais = true;
        this.disableMunicipio = false;
        this.bajaHabitantes.paiProDesti = "108";
        break;
      case "4": // Traslado
        this.disablePais = true;
        this.disableMunicipio = false;
        if (!this.bajaHabitantes.proProDesti) {
          Swal.fire("Los campos Provincia y Municipio son obligatorios");
        }
        break;
      case "5": // Emigración
        this.disablePais = false;
        this.disableMunicipio = true;
        this.bajaHabitantes.paiProDesti = "sin datos";
        break;
      case "6": // Caducidad
        this.disablePais = true;
        this.disableMunicipio = true;
        this.bajaHabitantes.paiProDesti = "";
        this.bajaHabitantes.proProDesti = "";
        break;
      default:
        break;
    }
  }

  // Envía la baja al endpoint. Realiza validaciones previas.
  public bajaHabitante(): void {
    if (this.bajaHabitantes.tipBaja === "4" && !this.bajaHabitantes.proProDesti) {
      Swal.fire("Los campos Provincia y Municipio son obligatorios");
      return;
    }
    if (this.bajaHabitantes.tipBaja === "5" && this.bajaHabitantes.paiProDesti === "sin datos") {
      Swal.fire("El campo País es obligatorio");
      return;
    }

    // Ajusta el valor de munProDesti si es necesario
    try {
      let munProDesti: string = this.bajaHabitantes.munProDesti;
      if (munProDesti && munProDesti.length > 2) {
        this.bajaHabitantes.munProDesti = munProDesti.slice(-2);
      }
    } catch (error) {
      console.error(error);
    }

    Swal.fire({
      title: '¿Está seguro?',
      text: "Dar de baja a: " + this.persona.desPerEntid,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expedientesService.envioBajaHabitantes(this.bajaHabitantes, this.persona.numDocum)
          .subscribe(
            respuesta => {
              Swal.fire('Baja realizada', '', 'success');
            },
            err => {
              Swal.fire(err.error.message || 'Error al dar de baja', '', 'warning');
            }
          );
      }
    });
  }
}
