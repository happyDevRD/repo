import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InsideSoapResponse } from '../../models/inside';
import {
  INSIDE_GINSIDE_OPERATIONS,
  INSIDE_OPERATION_ENDPOINT,
  InsideSoapOperation,
  InsideWebServiceType,
  buildSoapAction,
} from './inside.constants';
import {
  buildDryRunSoapResponseXml,
} from './inside-soap-dry-run.mock';
import { parseInsideSoapResponse } from './inside-soap-response.parser';

export interface InsideEnvironmentConfig {
  insideWsUrl: string;
  gInsideWsUrl: string;
  puntoRemisionWsUrl: string;
  useBackendProxy?: boolean;
  proxyBaseUrl?: string;
  dryRun?: boolean;
  ofrecerEnvioTrasCierre?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class InsideSoapClient {
  private readonly http = inject(HttpClient);
  private readonly config: InsideEnvironmentConfig = environment.inside;

  invoke(
    operation: InsideSoapOperation,
    envelope: string,
    options?: {
      endpoint?: InsideWebServiceType;
      useFilesNamespace?: boolean;
    },
  ): Observable<InsideSoapResponse> {
    const endpointType = options?.endpoint ?? INSIDE_OPERATION_ENDPOINT[operation];
    const url = this.resolveEndpoint(endpointType);
    const useFilesNamespace = options?.useFilesNamespace ?? INSIDE_GINSIDE_OPERATIONS.has(operation);
    const soapAction = buildSoapAction(operation, useFilesNamespace);

    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      SOAPAction: `"${soapAction}"`,
    });

    if (this.config.dryRun) {
      const mockXml = buildDryRunSoapResponseXml(operation);
      return of(parseInsideSoapResponse(mockXml));
    }

    const requestUrl = this.config.useBackendProxy
      ? `${this.config.proxyBaseUrl ?? `${environment.apiUrl}inside/soap`}/${endpointType}`
      : url;

    return this.http.post(requestUrl, envelope, { headers, responseType: 'text' }).pipe(
      map((rawXml) => parseInsideSoapResponse(rawXml)),
      catchError((error: HttpErrorResponse) => this.handleError(operation, error)),
    );
  }

  isDryRunEnabled(): boolean {
    return this.config.dryRun === true;
  }

  private resolveEndpoint(endpointType: InsideWebServiceType): string {
    switch (endpointType) {
      case InsideWebServiceType.GInsideWS:
        return this.config.gInsideWsUrl;
      case InsideWebServiceType.PuntoRemisionWS:
        return this.config.puntoRemisionWsUrl;
      case InsideWebServiceType.InsideWS:
      default:
        return this.config.insideWsUrl;
    }
  }

  private handleError(operation: InsideSoapOperation, error: HttpErrorResponse): Observable<never> {
    const message = error.error instanceof ErrorEvent
      ? error.error.message
      : `INSIDE [${operation}] respondió con código ${error.status}`;

    console.error('[InsideSoapClient]', message, error);
    return throwError(() => new Error(`Error en la llamada SOAP a INSIDE (${operation}): ${message}`));
  }
}
