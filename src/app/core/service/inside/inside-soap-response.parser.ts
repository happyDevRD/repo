import { InsideSoapResponse } from '../../models/inside';

const RESPONSE_TAGS = [
  'codigoRespuesta',
  'descripcionRespuesta',
  'identificador',
  'csv',
  'codigoEnvioATEA',
  'uuid',
  'estadoRemision',
] as const;

export const parseInsideSoapResponse = (rawXml: string): InsideSoapResponse => {
  const parser = new DOMParser();
  const document = parser.parseFromString(rawXml, 'text/xml');

  const parserError = document.querySelector('parsererror');
  if (parserError) {
    throw new Error('La respuesta SOAP de INSIDE no es un XML válido.');
  }

  const faultString = document.getElementsByTagName('faultstring')[0]?.textContent?.trim();
  if (faultString) {
    throw new Error(`Error SOAP INSIDE: ${faultString}`);
  }

  const response: InsideSoapResponse = { rawXml };

  for (const tag of RESPONSE_TAGS) {
    const value = document.getElementsByTagName(tag)[0]?.textContent?.trim();
    if (value) {
      response[tag] = value;
    }
  }

  return response;
};
