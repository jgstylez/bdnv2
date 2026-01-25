/**
 * Logger Utility
 * 
 * Centralized logging system for the application
 * - Supports different log levels (debug, info, warn, error)
 * - Can be configured for production (disable debug/info)
 * - Provides better error context
 * - Ready for integration with error tracking services (e.g., Sentry)
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;
  private enabledLevels: Set<LogLevel>;

  constructor() {
    // In production, you might want to check process.env.NODE_ENV
    this.isDevelopment = true; // Set to false in production
    this.enabledLevels = new Set<LogLevel>(["debug", "info", "warn", "error"]);
    
    // In production, disable debug and info
    if (!this.isDevelopment) {
      this.enabledLevels.delete("debug");
      this.enabledLevels.delete("info");
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return this.enabledLevels.has(level);
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    let contextStr = "";
    if (context) {
      try {
        contextStr = ` ${JSON.stringify(context)}`;
      } catch (error) {
        contextStr = ` [Context serialization failed: ${String(error)}]`;
      }
    }
    return `[${timestamp}] [${level.toUpperCase()}] ${message || '(no message)'}${contextStr}`;
  }

  /**
   * Debug logs - detailed information for debugging
   * Only shown in development
   */
  debug(message: string, context?: LogContext): void {
    if (this.shouldLog("debug")) {
      console.log(this.formatMessage("debug", message, context));
    }
  }

  /**
   * Info logs - general information
   * Only shown in development
   */
  info(message: string, context?: LogContext): void {
    if (this.shouldLog("info")) {
      console.log(this.formatMessage("info", message, context));
    }
  }

  /**
   * Warning logs - warnings that don't break functionality
   * Always shown
   */
  warn(message: string, context?: LogContext): void {
    if (this.shouldLog("warn")) {
      console.warn(this.formatMessage("warn", message, context));
    }
  }

  /**
   * Error logs - errors that need attention
   * Always shown
   * In production, these should be sent to error tracking service
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    if (this.shouldLog("error")) {
      try {
        const errorContext: LogContext = {
          ...(context || {}),
          error: error instanceof Error ? {
            message: error.message || '(no error message)',
            stack: error.stack || '(no stack trace)',
            name: error.name || 'Error',
          } : error !== undefined && error !== null ? String(error) : '(no error details)',
        };
        console.error(this.formatMessage("error", message || '(no message)', errorContext));
      } catch (formatError) {
        // Fallback if formatting fails
        console.error(`[${new Date().toISOString()}] [ERROR]`, message || '(no message)', error, context);
      }
      
      // TODO: In production, send to error tracking service (e.g., Sentry)
      // if (!this.isDevelopment) {
      //   Sentry.captureException(error, { extra: context });
      // }
    }
  }

  /**
   * Set log level (useful for testing or production configuration)
   */
  setLogLevel(level: LogLevel, enabled: boolean): void {
    if (enabled) {
      this.enabledLevels.add(level);
    } else {
      this.enabledLevels.delete(level);
    }
  }

  /**
   * Enable/disable development mode
   */
  setDevelopmentMode(enabled: boolean): void {
    this.isDevelopment = enabled;
    if (!enabled) {
      this.enabledLevels.delete("debug");
      this.enabledLevels.delete("info");
    } else {
      this.enabledLevels.add("debug");
      this.enabledLevels.add("info");
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = (message: string, context?: LogContext) => logger.debug(message, context);
export const logInfo = (message: string, context?: LogContext) => logger.info(message, context);
export const logWarn = (message: string, context?: LogContext) => logger.warn(message, context);
export const logError = (message: string, error?: Error | unknown, context?: LogContext) => logger.error(message, error, context);

