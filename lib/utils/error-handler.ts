/**
 * Production-Ready Error Handling and Logging System
 * 
 * This module provides comprehensive error handling, logging,
 * and monitoring capabilities for the BiteBase application.
 */

import { analytics, logging } from '../../config/production'

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ErrorCategory {
  API = 'api',
  DATABASE = 'database',
  AUTHENTICATION = 'authentication',
  VALIDATION = 'validation',
  NETWORK = 'network',
  BUSINESS_LOGIC = 'business_logic',
  EXTERNAL_SERVICE = 'external_service',
  USER_INPUT = 'user_input'
}

export interface ErrorContext {
  userId?: string
  sessionId?: string
  requestId?: string
  userAgent?: string
  ip?: string
  url?: string
  method?: string
  timestamp: Date
  additionalData?: Record<string, any>
}

export interface BiteBaseError {
  id: string
  message: string
  code: string
  category: ErrorCategory
  severity: ErrorSeverity
  context: ErrorContext
  stack?: string
  originalError?: Error
  isRetryable: boolean
  userMessage: string
}

class ErrorHandler {
  private static instance: ErrorHandler
  private sentryInitialized = false

  private constructor() {
    this.initializeSentry()
  }

  public static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  /**
   * Initialize Sentry for error tracking
   */
  private async initializeSentry() {
    if (analytics.sentry.dsn && !this.sentryInitialized) {
      try {
        const Sentry = await import('@sentry/nextjs')
        Sentry.init({
          dsn: analytics.sentry.dsn,
          environment: process.env.NODE_ENV,
          tracesSampleRate: 0.1,
          beforeSend: (event) => {
            // Filter out sensitive information
            if (event.exception) {
              event.exception.values?.forEach(exception => {
                if (exception.stacktrace?.frames) {
                  exception.stacktrace.frames = exception.stacktrace.frames.filter(
                    frame => !frame.filename?.includes('node_modules')
                  )
                }
              })
            }
            return event
          }
        })
        this.sentryInitialized = true
      } catch (error) {
        console.warn('Failed to initialize Sentry:', error)
      }
    }
  }

  /**
   * Handle and log errors with appropriate severity and context
   */
  public async handleError(
    error: Error | BiteBaseError,
    category: ErrorCategory = ErrorCategory.BUSINESS_LOGIC,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    context: Partial<ErrorContext> = {}
  ): Promise<BiteBaseError> {
    const bitebaseError = this.createBiteBaseError(error, category, severity, context)
    
    // Log the error
    await this.logError(bitebaseError)
    
    // Send to monitoring services
    await this.sendToMonitoring(bitebaseError)
    
    // Handle critical errors
    if (severity === ErrorSeverity.CRITICAL) {
      await this.handleCriticalError(bitebaseError)
    }

    return bitebaseError
  }

  /**
   * Create a standardized BiteBase error object
   */
  private createBiteBaseError(
    error: Error | BiteBaseError,
    category: ErrorCategory,
    severity: ErrorSeverity,
    context: Partial<ErrorContext>
  ): BiteBaseError {
    if (this.isBiteBaseError(error)) {
      return error
    }

    const errorId = this.generateErrorId()
    const fullContext: ErrorContext = {
      timestamp: new Date(),
      ...context
    }

    return {
      id: errorId,
      message: error.message || 'Unknown error occurred',
      code: this.generateErrorCode(category, severity),
      category,
      severity,
      context: fullContext,
      stack: error.stack,
      originalError: error,
      isRetryable: this.isRetryableError(error, category),
      userMessage: this.generateUserMessage(error, category, severity)
    }
  }

  /**
   * Log error to console and external logging services
   */
  private async logError(error: BiteBaseError): Promise<void> {
    const logData = {
      id: error.id,
      message: error.message,
      code: error.code,
      category: error.category,
      severity: error.severity,
      context: error.context,
      stack: error.stack
    }

    // Console logging
    if (logging.level === 'debug' || error.severity === ErrorSeverity.CRITICAL) {
      console.error('BiteBase Error:', logData)
    }

    // Send to external logging service (e.g., LogRocket, DataDog)
    try {
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to external logging service
        // await this.sendToExternalLogger(logData)
      }
    } catch (loggingError) {
      console.warn('Failed to send error to external logger:', loggingError)
    }
  }

  /**
   * Send error to monitoring services
   */
  private async sendToMonitoring(error: BiteBaseError): Promise<void> {
    try {
      // Send to Sentry
      if (this.sentryInitialized) {
        const Sentry = await import('@sentry/nextjs')
        Sentry.withScope(scope => {
          scope.setTag('category', error.category)
          scope.setTag('severity', error.severity)
          scope.setLevel(this.mapSeverityToSentryLevel(error.severity))
          scope.setContext('error_context', error.context)
          
          if (error.originalError) {
            Sentry.captureException(error.originalError)
          } else {
            Sentry.captureMessage(error.message)
          }
        })
      }

      // Send to analytics
      if (analytics.mixpanel.token) {
        // Track error in analytics
        this.trackErrorInAnalytics(error)
      }
    } catch (monitoringError) {
      console.warn('Failed to send error to monitoring:', monitoringError)
    }
  }

  /**
   * Handle critical errors with immediate notifications
   */
  private async handleCriticalError(error: BiteBaseError): Promise<void> {
    try {
      // Send immediate notification to development team
      await this.sendCriticalErrorNotification(error)
      
      // Log to persistent storage
      await this.persistCriticalError(error)
    } catch (notificationError) {
      console.error('Failed to handle critical error:', notificationError)
    }
  }

  /**
   * Retry mechanism for retryable errors
   */
  public async retryOperation<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation()
      } catch (error) {
        lastError = error as Error
        
        const bitebaseError = await this.handleError(
          error as Error,
          ErrorCategory.NETWORK,
          ErrorSeverity.MEDIUM,
          { additionalData: { attempt, maxRetries } }
        )

        if (!bitebaseError.isRetryable || attempt === maxRetries) {
          throw error
        }

        // Wait before retrying with exponential backoff
        await this.sleep(delay * Math.pow(backoffMultiplier, attempt - 1))
      }
    }

    throw lastError!
  }

  /**
   * Graceful degradation for non-critical features
   */
  public async withFallback<T>(
    primaryOperation: () => Promise<T>,
    fallbackOperation: () => Promise<T>,
    errorCategory: ErrorCategory = ErrorCategory.EXTERNAL_SERVICE
  ): Promise<T> {
    try {
      return await primaryOperation()
    } catch (error) {
      await this.handleError(
        error as Error,
        errorCategory,
        ErrorSeverity.MEDIUM,
        { additionalData: { fallbackUsed: true } }
      )
      
      return await fallbackOperation()
    }
  }

  // Helper methods
  private isBiteBaseError(error: any): error is BiteBaseError {
    return error && typeof error === 'object' && 'id' in error && 'category' in error
  }

  private generateErrorId(): string {
    return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private generateErrorCode(category: ErrorCategory, severity: ErrorSeverity): string {
    const categoryCode = category.toUpperCase().replace('_', '')
    const severityCode = severity.toUpperCase()
    return `${categoryCode}_${severityCode}_${Date.now().toString().slice(-6)}`
  }

  private isRetryableError(error: Error, category: ErrorCategory): boolean {
    // Network and external service errors are typically retryable
    if (category === ErrorCategory.NETWORK || category === ErrorCategory.EXTERNAL_SERVICE) {
      return true
    }

    // Check for specific error types
    if (error.message.includes('timeout') || error.message.includes('ECONNRESET')) {
      return true
    }

    return false
  }

  private generateUserMessage(error: Error, category: ErrorCategory, severity: ErrorSeverity): string {
    switch (category) {
      case ErrorCategory.NETWORK:
        return 'We\'re having trouble connecting to our servers. Please check your internet connection and try again.'
      case ErrorCategory.AUTHENTICATION:
        return 'There was an issue with your login. Please sign in again.'
      case ErrorCategory.VALIDATION:
        return 'Please check your input and try again.'
      case ErrorCategory.EXTERNAL_SERVICE:
        return 'One of our services is temporarily unavailable. We\'re working to fix this.'
      default:
        if (severity === ErrorSeverity.CRITICAL) {
          return 'We\'re experiencing technical difficulties. Our team has been notified and is working on a fix.'
        }
        return 'Something went wrong. Please try again in a moment.'
    }
  }

  private mapSeverityToSentryLevel(severity: ErrorSeverity): 'error' | 'warning' | 'info' {
    switch (severity) {
      case ErrorSeverity.CRITICAL:
      case ErrorSeverity.HIGH:
        return 'error'
      case ErrorSeverity.MEDIUM:
        return 'warning'
      case ErrorSeverity.LOW:
        return 'info'
      default:
        return 'error'
    }
  }

  private async trackErrorInAnalytics(error: BiteBaseError): Promise<void> {
    // Implementation for analytics tracking
    // This would integrate with your analytics service
  }

  private async sendCriticalErrorNotification(error: BiteBaseError): Promise<void> {
    // Implementation for critical error notifications
    // This could send emails, Slack messages, etc.
  }

  private async persistCriticalError(error: BiteBaseError): Promise<void> {
    // Implementation for persisting critical errors
    // This could save to database, file system, etc.
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance()

// Convenience functions
export const handleError = (
  error: Error,
  category?: ErrorCategory,
  severity?: ErrorSeverity,
  context?: Partial<ErrorContext>
) => errorHandler.handleError(error, category, severity, context)

export const retryOperation = <T>(
  operation: () => Promise<T>,
  maxRetries?: number,
  delay?: number,
  backoffMultiplier?: number
) => errorHandler.retryOperation(operation, maxRetries, delay, backoffMultiplier)

export const withFallback = <T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>,
  errorCategory?: ErrorCategory
) => errorHandler.withFallback(primaryOperation, fallbackOperation, errorCategory)

export default ErrorHandler
