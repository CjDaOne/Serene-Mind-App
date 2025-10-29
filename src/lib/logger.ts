type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogContext {
  userId?: string;
  page?: string;
  action?: string;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'apiKey', 'authorization'];

function sanitizeContext(context: LogContext): LogContext {
  const sanitized = { ...context };
  
  for (const key of Object.keys(sanitized)) {
    if (SENSITIVE_KEYS.some(sensitive => key.toLowerCase().includes(sensitive))) {
      sanitized[key] = '[REDACTED]';
    }
  }
  
  return sanitized;
}

function shouldLog(level: LogLevel): boolean {
  const isDev = process.env.NODE_ENV === 'development';
  const isTest = process.env.NODE_ENV === 'test';
  
  if (isTest) return false;
  if (isDev) return true;
  
  return level === 'error' || level === 'warn';
}

function formatLog(level: LogLevel, message: string, context?: LogContext): string {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? sanitizeContext(context) : {};
  
  return JSON.stringify({
    timestamp,
    level,
    message,
    ...sanitizedContext,
  });
}

export const logger = {
  error(message: string, context?: LogContext) {
    if (!shouldLog('error')) return;
    console.error(formatLog('error', message, context));
  },

  warn(message: string, context?: LogContext) {
    if (!shouldLog('warn')) return;
    console.warn(formatLog('warn', message, context));
  },

  info(message: string, context?: LogContext) {
    if (!shouldLog('info')) return;
    console.info(formatLog('info', message, context));
  },

  debug(message: string, context?: LogContext) {
    if (!shouldLog('debug')) return;
    console.debug(formatLog('debug', message, context));
  },
};
