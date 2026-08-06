import { describe, it, expect } from 'vitest';
import { mergeHeaders } from '../headers';

describe('mergeHeaders', () => {
  it('debe mantener application/json por defecto', () => {
    const config = {
      headers: {},
      data: {
        name: 'Colibri',
      },
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers['Content-Type']).toBe('application/json');

    expect(headers.Authorization).toBe('Bearer TOKEN');

    expect(headers.Accept).toBe('application/json');
  });

  it('debe eliminar Content-Type para FormData', () => {
    const form = new FormData();

    form.append('file', new Blob(['hola']));

    const config = {
      headers: {},
      data: form,
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers['Content-Type']).toBeUndefined();

    expect(headers.Authorization).toBe('Bearer TOKEN');
  });

  it('debe enviar application/json cuando no hay body', () => {
    const config = {
      headers: {},
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers['Content-Type']).toBe('application/json');
  });

  it('no elimina Authorization cuando existen headers personalizados', () => {
    const config = {
      headers: {
        'X-Tenant': 'colibri',
      },
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers.Authorization).toBe('Bearer TOKEN');

    expect(headers['X-Tenant']).toBe('colibri');
  });

  it('ignora Authorization undefined', () => {
    const config = {
      headers: {
        Authorization: undefined,
      },
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers.Authorization).toBe('Bearer TOKEN');
  });
  it('permite sobrescribir Content-Type explícitamente', () => {
    const config = {
      headers: {
        'Content-Type': 'application/xml',
      },
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers['Content-Type']).toBe('application/xml');
  });

  it('siempre mantiene Accept', () => {
    const config = {
      headers: {},
    };

    const headers = mergeHeaders(config, 'TOKEN');

    expect(headers.Accept).toBe('application/json');
  });
});
