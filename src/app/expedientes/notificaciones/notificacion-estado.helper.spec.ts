import { obtenerEstadoPorCodigo, botonesPorEstadoNotificacion } from './notificacion-estado.helper';

describe('notificacion-estado.helper', () => {
  it('mapea estados Notifica 7-10', () => {
    expect(obtenerEstadoPorCodigo(7)).toBe('NOTIFICA_GENERADA');
    expect(obtenerEstadoPorCodigo(8)).toBe('NOTIFICA_ENVIADA');
    expect(obtenerEstadoPorCodigo(9)).toBe('CADUCADA');
    expect(obtenerEstadoPorCodigo(10)).toBe('RECHAZADA');
  });

  it('muestra sincronizar en NOTIFICA_ENVIADA', () => {
    const botones = botonesPorEstadoNotificacion('NOTIFICA_ENVIADA', {});
    expect(botones.veoSincronizarNotifica).toBeTrue();
    expect(botones.veoEnviarNotifica).toBeFalse();
  });

  it('muestra enviar Notifica en GENERADA', () => {
    const botones = botonesPorEstadoNotificacion('GENERADA', {});
    expect(botones.veoEnviarNotifica).toBeTrue();
    expect(botones.veoenviar).toBeTrue();
  });
});
