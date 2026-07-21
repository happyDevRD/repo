import { InsideSoapOperation } from './inside.constants';

const MOCK_NAMESPACE = 'https://sede.administracion.gob.es/ws/inside/v1';

const buildResponseElement = (operation: InsideSoapOperation): string => {
  const suffix = operation.charAt(0).toUpperCase() + operation.slice(1);
  return `${suffix}Response`;
};

export const buildDryRunSoapResponseXml = (
  operation: InsideSoapOperation,
): string => {
  const timestamp = Date.now();
  const identificador = `MOCK-INSIDE-${operation}-${timestamp}`;
  const csv = `MOCK-CSV-${timestamp}`;
  const codigoAtea = `MOCK-ATEA-${timestamp}`;
  const responseElement = buildResponseElement(operation);

  const extraFields = operation === InsideSoapOperation.RemisionAJusticia
    || operation === InsideSoapOperation.ConsultaEstadoRemisionAJusticia
    ? `<codigoEnvioATEA>${codigoAtea}</codigoEnvioATEA>
       <estadoRemision>ENVIADO_SIMULADO</estadoRemision>`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ns2:${responseElement} xmlns:ns2="${MOCK_NAMESPACE}">
      <codigoRespuesta>00</codigoRespuesta>
      <descripcionRespuesta>Operación simulada (dry-run) — sin acceso a REDSARA</descripcionRespuesta>
      <identificador>${identificador}</identificador>
      <csv>${csv}</csv>
      ${extraFields}
    </ns2:${responseElement}>
  </soap:Body>
</soap:Envelope>`;
};

export const resolveOperationFromSoapAction = (soapAction: string): InsideSoapOperation | null => {
  const normalized = soapAction.replace(/"/g, '').trim();
  const match = Object.values(InsideSoapOperation).find((operation) =>
    normalized.toLowerCase().includes(operation.toLowerCase()),
  );
  return match ?? null;
};
