import { Component, Input, OnInit } from '@angular/core';
import { PersonaEntidad } from '../../core/models/personaentidad.model';
import { MUNICIO, PROVIN } from '../../core/constants/datos';
import Swal from 'sweetalert2';
import { ExpedientesService } from '../../expedientes/expedientes.service';

@Component({
  selector: 'app-modificar-datos-persona',
  templateUrl: './modificar-datos-persona.component.html',
  styleUrls: ['./modificar-datos-persona.component.css']
})
export class ModificarDatosPersonaComponent implements OnInit {
  @Input() persona: PersonaEntidad;

  public provincia = PROVIN;
  public municipio = MUNICIO;

  public municipioFiltro: any[] = [];  // Lista filtrada de municipios para la provincia seleccionada.

  constructor(private expedientesService: ExpedientesService) {}

  ngOnInit(): void {
    if (this.persona && this.persona.codProvi) {
      this.filterMunicipios();
    }
  }

  /**
   * Filtra la lista de municipios en base al código de provincia.
   */
  filterMunicipios(): void {
    const provId = this.persona.codProvi.padStart(2, '0');

    // Filtramos los municipios que comienzan con el código de la provincia.
    this.municipioFiltro = this.municipio.filter(municipio =>
      municipio.id.startsWith(provId)
    );

    let municId: string = this.persona.codMunic;
    if (municId.length !== 5) {
      municId = provId + municId.padStart(3, '0');
    }

    const currentMunic = this.municipio.find(municipio => municipio.id === municId);
    if (currentMunic) {
      this.persona.codMunic = currentMunic.id;
      this.persona.municipio = currentMunic.nm;
    } else if (this.municipioFiltro.length > 0) {
      // Si el municipio actual no pertenece a la nueva provincia, asignamos el primer municipio filtrado.
      this.persona.codMunic = this.municipioFiltro[0].id;
      this.persona.municipio = this.municipioFiltro[0].nm;
    } else {
      this.persona.codMunic = '';
      this.persona.municipio = '';
    }

  }


  onProvinciaChange(): void {
    this.filterMunicipios();
  }

  onMunicipioChange(): void {
    const selectedMunicipio = this.municipioFiltro.find(m => m.id === this.persona.codMunic);
    if (selectedMunicipio) {
      this.persona.municipio = selectedMunicipio.nm;
    }
  }

  onActualizarDatos(): void {
    if (!this.persona.nombre || !this.persona.apellido1) {
      Swal.fire('Debe completar los campos obligatorios.').then(r => r);
      return;
    }

    const { provincia, municipio, ...payload } = {
      ...this.persona,
      codProvi: this.persona.codProvi.toString(),
      codMunic: this.persona.codMunic.toString()
    };

    // eliminamos los dos primeros o el código de la provincia
    if (payload.codMunic && payload.codMunic.length === 5) {
      payload.codMunic = payload.codMunic.substring(2);
    }

    this.expedientesService.modificaPersonaEntidad(payload as any).subscribe({
      next: (respuesta) => {
        Swal.fire('Datos Modificados', '', 'success').then(r => r);
        this.persona = { ...respuesta };
        this.filterMunicipios();
      },
      error: (err) => {
        Swal.fire(err.error.message || 'Error al modificar datos.', '', 'warning').then(r => r);
      }
    });
  }
}
