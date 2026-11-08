// Small leveled logger so views never call `console` directly.
//
// The level comes from REACT_APP_LOG_LEVEL (debug | info | warn | error | silent).
// Default: `debug` in development, `warn` in production builds, `silent` in tests.
const LEVELS = { debug: 10, info: 20, warn: 30, error: 40, silent: 100 };

const DEFAULT_LEVEL = { production: 'warn', test: 'silent' }[import.meta.env.MODE] || 'debug';
const threshold = LEVELS[import.meta.env.REACT_APP_LOG_LEVEL] ?? LEVELS[DEFAULT_LEVEL];

// Axios errors carry the whole request/response; keep only what helps debugging.
const describe = (value) => {
  if (!value?.isAxiosError) {
    return value;
  }
  const { config = {}, response } = value;
  return {
    message: value.message,
    // Same id as in the DaaS backend and auth service logs
    requestId: config.headers?.['X-Request-ID'],
    request: `${(config.method || 'get').toUpperCase()} ${config.baseURL || ''}${config.url || ''}`,
    status: response?.status,
    data: response?.data,
  };
};

const write = (level, scope, message, details) => {
  if (LEVELS[level] < threshold) {
    return;
  }
  const prefix = `[${level.toUpperCase()}] [${scope}] ${message}`;
  const method = level === 'debug' ? 'log' : level;
  if (details === undefined) {
    console[method](prefix);
  } else {
    console[method](prefix, describe(details));
  }
};

// One logger per module, named after it, e.g. createLogger('SettingsDocker').
export const createLogger = (scope) => ({
  debug: (message, details) => write('debug', scope, message, details),
  info: (message, details) => write('info', scope, message, details),
  warn: (message, details) => write('warn', scope, message, details),
  error: (message, details) => write('error', scope, message, details),
});

export default createLogger;
