/**
 * Logger Utility
 * Provides a standardized way to log messages.
 * In a real production environment, this would integrate with Sentry/Datadog.
 */

const LOG_LEVELS = {
    INFO: 'info',
    WARN: 'warn',
    ERROR: 'error',
    DEBUG: 'debug',
};

const isDev = import.meta.env.DEV;

class Logger {
    info(message, meta = {}) {
        if (isDev) {
            console.info(`%c[INFO] ${message}`, 'color: cyan', meta);
        }
        // TODO: Send to remote transport
    }

    warn(message, meta = {}) {
        console.warn(`[WARN] ${message}`, meta);
        // TODO: Send to remote transport
    }

    error(message, error = null, meta = {}) {
        console.error(`[ERROR] ${message}`, error, meta);
        // TODO: Send to Sentry
    }

    debug(message, meta = {}) {
        if (isDev) {
            console.debug(`%c[DEBUG] ${message}`, 'color: gray', meta);
        }
    }
}

export const logger = new Logger();
