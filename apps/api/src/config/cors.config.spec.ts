import {
  normalizeOrigin,
  patternToRegex,
  isOriginAllowed,
  getAllowedOrigins,
  getCorsConfig,
} from './cors.config';

describe('CORS Configuration', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('normalizeOrigin', () => {
    it('deve remover barras finais e transformar em minúsculo', () => {
      expect(normalizeOrigin('https://MEU-APP.vercel.app/')).toBe('https://meu-app.vercel.app');
      expect(normalizeOrigin('http://localhost:3000///')).toBe('http://localhost:3000');
    });
  });

  describe('patternToRegex', () => {
    it('deve casar subdomínios da Vercel', () => {
      const regex = patternToRegex('https://*.vercel.app');
      expect(regex.test('https://politica-tracker.vercel.app')).toBe(true);
      expect(regex.test('https://preview-123.vercel.app')).toBe(true);
      expect(regex.test('http://politica-tracker.vercel.app')).toBe(false);
      expect(regex.test('https://outrodominio.com')).toBe(false);
    });

    it('deve casar padrões sem protocolo explícito tanto para http quanto https', () => {
      const regex = patternToRegex('*.meusite.com.br');
      expect(regex.test('https://app.meusite.com.br')).toBe(true);
      expect(regex.test('http://app.meusite.com.br')).toBe(true);
      expect(regex.test('https://outro.com')).toBe(false);
    });
  });

  describe('isOriginAllowed', () => {
    it('deve permitir qualquer origem quando "*" estiver nos padrões', () => {
      expect(isOriginAllowed('https://qualquercoisa.com', ['*'], false)).toBe(true);
    });

    it('deve permitir origens exatas listadas', () => {
      const allowed = ['https://meu-front.com', 'https://outro-front.com'];
      expect(isOriginAllowed('https://meu-front.com', allowed, false)).toBe(true);
      expect(isOriginAllowed('https://meu-front.com/', allowed, false)).toBe(true);
      expect(isOriginAllowed('https://desconhecido.com', allowed, false)).toBe(false);
    });

    it('deve permitir padrões com curinga (*)', () => {
      const allowed = ['https://*.vercel.app'];
      expect(isOriginAllowed('https://deploy-preview.vercel.app', allowed, false)).toBe(true);
      expect(isOriginAllowed('https://hacker.com', allowed, false)).toBe(false);
    });

    it('deve permitir localhost em ambiente de desenvolvimento', () => {
      expect(isOriginAllowed('http://localhost:3000', ['https://producao.com'], true)).toBe(true);
      expect(isOriginAllowed('http://localhost:5173', ['https://producao.com'], true)).toBe(true);
      expect(isOriginAllowed('http://127.0.0.1:3000', ['https://producao.com'], true)).toBe(true);
    });

    it('deve bloquear localhost em produção se não estiver explicitamente configurado', () => {
      expect(isOriginAllowed('http://localhost:3000', ['https://producao.com'], false)).toBe(false);
    });
  });

  describe('getAllowedOrigins', () => {
    it('deve separar por vírgula a variável CORS_ORIGIN', () => {
      process.env.CORS_ORIGIN = 'https://app1.com, https://app2.com , https://*.vercel.app';
      expect(getAllowedOrigins()).toEqual([
        'https://app1.com',
        'https://app2.com',
        'https://*.vercel.app',
      ]);
    });

    it('deve retornar ["*"] por padrão caso nenhuma variável esteja configurada', () => {
      delete process.env.CORS_ORIGIN;
      delete process.env.ALLOWED_ORIGINS;
      delete process.env.FRONTEND_URL;
      expect(getAllowedOrigins()).toEqual(['*']);
    });
  });

  describe('getCorsConfig', () => {
    it('deve invocar o callback com true para origens válidas ou vazias', (done) => {
      process.env.CORS_ORIGIN = 'https://meu-front.com';
      const config = getCorsConfig();
      const originFn = config.origin as (origin: string | undefined, cb: (err: any, allow?: boolean) => void) => void;

      // Sem origin (curl/mobile)
      originFn(undefined, (err, allow) => {
        expect(err).toBeNull();
        expect(allow).toBe(true);
      });

      // Origem autorizada
      originFn('https://meu-front.com', (err, allow) => {
        expect(err).toBeNull();
        expect(allow).toBe(true);
      });

      // Origem bloqueada
      originFn('https://desconhecido.com', (err, allow) => {
        expect(err).toBeNull();
        expect(allow).toBe(false);
        done();
      });
    });
  });
});
