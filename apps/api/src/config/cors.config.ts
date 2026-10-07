import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { Logger } from '@nestjs/common';

const logger = new Logger('CORS');

/**
 * Normaliza uma URL de origem removendo espaços e barras no final.
 */
export function normalizeOrigin(origin: string): string {
  return origin.trim().replace(/\/+$/, '').toLowerCase();
}

/**
 * Converte um padrão de origem com curingas '*' em expressão regular.
 * Exemplos:
 * - 'https://*.vercel.app' -> casa qualquer subdomínio na Vercel com HTTPS
 * - '*.meusite.com.br'     -> casa qualquer subdomínio em HTTP ou HTTPS
 * - 'https://meu-app.com'  -> casa exatamente o domínio
 */
export function patternToRegex(pattern: string): RegExp {
  let p = normalizeOrigin(pattern);

  // Se o padrão não especificar protocolo, aceita tanto http quanto https
  const hasProtocol = p.startsWith('http://') || p.startsWith('https://');
  const protocolPrefix = hasProtocol ? '' : 'https?://';

  // Escapa caracteres especiais de regex, preservando o curinga '*'
  const escaped = p
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '[a-zA-Z0-9-_.]+');

  return new RegExp(`^${protocolPrefix}${escaped}$`, 'i');
}

/**
 * Verifica se a origem da requisição é permitida segundo a lista configurada.
 */
export function isOriginAllowed(
  requestOrigin: string,
  allowedPatterns: string[],
  isDevelopment = process.env.NODE_ENV !== 'production',
): boolean {
  if (!requestOrigin) return true;

  // Se o curinga global estiver presente, permite qualquer origem
  if (allowedPatterns.includes('*')) {
    return true;
  }

  const normalized = normalizeOrigin(requestOrigin);

  for (const pattern of allowedPatterns) {
    if (!pattern) continue;

    const trimmed = pattern.trim();
    if (trimmed === '*') return true;

    if (trimmed.includes('*')) {
      const regex = patternToRegex(trimmed);
      if (regex.test(normalized)) {
        return true;
      }
    } else {
      const normPattern = normalizeOrigin(trimmed);
      // Se não tem protocolo no padrão, compara ignorando http/https
      if (!normPattern.startsWith('http://') && !normPattern.startsWith('https://')) {
        if (normalized === `http://${normPattern}` || normalized === `https://${normPattern}`) {
          return true;
        }
      } else if (normalized === normPattern) {
        return true;
      }
    }
  }

  // Em ambiente de desenvolvimento, aceita requisições locais automaticamente
  if (isDevelopment) {
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(normalized);
    if (isLocalhost) {
      return true;
    }
  }

  return false;
}

/**
 * Obtém a lista de origens autorizadas a partir das variáveis de ambiente.
 * Suporta CORS_ORIGIN, ALLOWED_ORIGINS ou FRONTEND_URL.
 */
export function getAllowedOrigins(): string[] {
  const envOrigins =
    process.env.CORS_ORIGIN ||
    process.env.ALLOWED_ORIGINS ||
    process.env.FRONTEND_URL ||
    '';

  const rawList = envOrigins
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  if (rawList.length === 0) {
    // Por padrão (se nada for configurado), aceitamos qualquer origem em modo dinâmico
    return ['*'];
  }

  return rawList;
}

/**
 * Retorna as opções completas de CORS para o NestJS/Express.
 */
export function getCorsConfig(): CorsOptions {
  const allowedOrigins = getAllowedOrigins();
  const isWildcardAll = allowedOrigins.includes('*');

  if (isWildcardAll) {
    logger.log(
      'CORS ativo em modo reflexivo (*): qualquer origem é aceita com suporte completo a credenciais.',
    );
  } else {
    logger.log(`CORS ativo para as seguintes origens: ${allowedOrigins.join(', ')}`);
  }

  return {
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // 1. Requisições sem cabeçalho Origin (curl, mobile apps nativos, tarefas de servidor, probes)
      if (!requestOrigin) {
        return callback(null, true);
      }

      // 2. Validação da origem
      if (isWildcardAll || isOriginAllowed(requestOrigin, allowedOrigins)) {
        // Retornar true faz o express-cors refletir a origem exata da requisição
        // Isso evita o erro de "Access-Control-Allow-Origin cannot be wildcard when credentials is true"
        return callback(null, true);
      }

      // 3. Origem não autorizada
      logger.warn(
        `[CORS Bloqueado] Origem não permitida: "${requestOrigin}". Adicione essa URL na variável de ambiente CORS_ORIGIN.`,
      );
      return callback(null, false);
    },
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'Range',
      'baggage',
      'sentry-trace',
    ],
    exposedHeaders: ['Content-Range', 'X-Total-Count', 'Authorization'],
    credentials: true,
    maxAge: 86400, // Cache de preflight por 24 horas para reduzir latência
    optionsSuccessStatus: 204,
  };
}
