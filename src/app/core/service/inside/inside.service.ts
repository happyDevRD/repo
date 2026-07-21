import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  InsideAltaDocumentoEniRequest,
  InsideAltaDocumentoEniXmlRequest,
  InsideAltaExpedienteEniXmlRequest,
  InsideComunicacionTokenExpedienteRequest,
  InsideConsultaEstadoRemisionRequest,
  InsideConvertirDocumentoAEniConMAdicionalesRequest,
  InsideConvertirDocumentoAEniRequest,
  InsideConvertirExpedienteAEniConMAdicionalesRequest,
  InsideConvertirExpedienteAEniRequest,
  InsideRemisionAJusticiaRequest,
  InsideSoapResponse,
} from '../../models/inside';
import { InsideSoapOperation, InsideWebServiceType } from './inside.constants';
import {
  buildAltaDocumentoEniEnvelope,
  buildAltaDocumentoEniXmlEnvelope,
  buildAltaExpedienteEniXmlEnvelope,
  buildComunicacionTokenExpedienteEnvelope,
  buildConsultaEstadoRemisionEnvelope,
  buildConvertirDocumentoAEniEnvelope,
  buildConvertirExpedienteAEniEnvelope,
  buildRemisionAJusticiaEnvelope,
} from './inside-soap-envelope.builder';
import { InsideSoapClient } from './inside-soap.client';

/**
 * Servicio de integración con INSIDE.
 * Encapsula las operaciones SOAP de:
 * - InsideWSService (Inside-OperacionesBasicas)
 * - GInsideWSService (GInside-OperacionesBasicas)
 * - PuntoRemisionWebService (PuntoRemisionWebService-OperacionesBasicas)
 */
@Injectable({
  providedIn: 'root',
})
export class InsideService {
  private readonly soapClient = inject(InsideSoapClient);

  altaDocumentoEni(request: InsideAltaDocumentoEniRequest): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.AltaDocumentoEni,
      buildAltaDocumentoEniEnvelope(request),
    );
  }

  altaDocumentoEniXml(request: InsideAltaDocumentoEniXmlRequest): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.AltaDocumentoEniXml,
      buildAltaDocumentoEniXmlEnvelope(request),
    );
  }

  altaExpedienteEniXml(request: InsideAltaExpedienteEniXmlRequest): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.AltaExpedienteEniXml,
      buildAltaExpedienteEniXmlEnvelope(request),
    );
  }

  convertirDocumentoAEni(request: InsideConvertirDocumentoAEniRequest): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConvertirDocumentoAEni,
      buildConvertirDocumentoAEniEnvelope(request, InsideSoapOperation.ConvertirDocumentoAEni),
    );
  }

  /** Variante GInside (WebServiceFiles) — CdU 2.1.2 / 2.1.5 / 2.1.6 */
  convertirDocumentoAEniGInside(
    request: InsideConvertirDocumentoAEniRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConvertirDocumentoAEni,
      buildConvertirDocumentoAEniEnvelope(request, InsideSoapOperation.ConvertirDocumentoAEni),
      { endpoint: InsideWebServiceType.GInsideWS, useFilesNamespace: true },
    );
  }

  convertirDocumentoAEniConMAdicionales(
    request: InsideConvertirDocumentoAEniConMAdicionalesRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConvertirDocumentoAEniConMAdicionales,
      buildConvertirDocumentoAEniEnvelope(
        request,
        InsideSoapOperation.ConvertirDocumentoAEniConMAdicionales,
      ),
    );
  }

  convertirExpedienteAEni(request: InsideConvertirExpedienteAEniRequest): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConvertirExpedienteAEni,
      buildConvertirExpedienteAEniEnvelope(request, InsideSoapOperation.ConvertirExpedienteAEni),
    );
  }

  /** Variante GInside (WebServiceFiles) — CdU 2.2.2 */
  convertirExpedienteAEniGInside(
    request: InsideConvertirExpedienteAEniRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConvertirExpedienteAEni,
      buildConvertirExpedienteAEniEnvelope(request, InsideSoapOperation.ConvertirExpedienteAEni),
      { endpoint: InsideWebServiceType.GInsideWS, useFilesNamespace: true },
    );
  }

  convertirExpedienteAEniConMAdicionales(
    request: InsideConvertirExpedienteAEniConMAdicionalesRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConvertirExpedienteAEniConMAdicionales,
      buildConvertirExpedienteAEniEnvelope(
        request,
        InsideSoapOperation.ConvertirExpedienteAEniConMAdicionales,
      ),
    );
  }

  consultaEstadoRemisionAJusticia(
    request: InsideConsultaEstadoRemisionRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConsultaEstadoRemisionAJusticia,
      buildConsultaEstadoRemisionEnvelope(request),
    );
  }

  /** Variante PuntoRemisionWebService — CdU 2.3.1 */
  consultaEstadoRemisionAJusticiaPuntoRemision(
    request: InsideConsultaEstadoRemisionRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ConsultaEstadoRemisionAJusticia,
      buildConsultaEstadoRemisionEnvelope(request),
      { endpoint: InsideWebServiceType.PuntoRemisionWS },
    );
  }

  remisionAJusticia(request: InsideRemisionAJusticiaRequest): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.RemisionAJusticia,
      buildRemisionAJusticiaEnvelope(request),
    );
  }

  comunicacionTokenExpediente(
    request: InsideComunicacionTokenExpedienteRequest,
  ): Observable<InsideSoapResponse> {
    return this.soapClient.invoke(
      InsideSoapOperation.ComunicacionTokenExpediente,
      buildComunicacionTokenExpedienteEnvelope(request),
    );
  }
}
