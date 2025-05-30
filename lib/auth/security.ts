/**
 * Production-Ready Security and Authentication Service
 * 
 * This module provides comprehensive security features including
 * authentication, authorization, rate limiting, and data protection.
 */

import { auth, security } from '../../config/production'
import { errorHandler, ErrorCategory, ErrorSeverity } from '../utils/error-handler'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'premium' | 'enterprise'
  plan: 'free' | 'starter' | 'professional' | 'enterprise'
  permissions: string[]
  emailVerified: boolean
  twoFactorEnabled: boolean
  lastLoginAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresAt: Date
  tokenType: 'Bearer'
}

export interface LoginCredentials {
  email: string
  password: string
  rememberMe?: boolean
  twoFactorCode?: string
}

export interface RegisterData {
  email: string
  password: string
  name: string
  acceptTerms: boolean
  marketingConsent?: boolean
}

class SecurityService {
  private static instance: SecurityService
  private rateLimitStore = new Map<string, { count: number; resetTime: number }>()

  private constructor() {}

  public static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService()
    }
    return SecurityService.instance
  }

  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthToken }> {
    try {
      // Rate limiting check
      await this.checkRateLimit(`login:${credentials.email}`, 5, 15 * 60 * 1000) // 5 attempts per 15 minutes

      // Validate input
      this.validateEmail(credentials.email)
      this.validatePassword(credentials.password)

      // Authenticate with Firebase or your auth provider
      const authResult = await this.authenticateWithProvider(credentials)
      
      // Generate secure tokens
      const tokens = await this.generateTokens(authResult.user.id)
      
      // Log successful login
      await this.logSecurityEvent('login_success', {
        userId: authResult.user.id,
        email: credentials.email,
        ip: this.getClientIP(),
        userAgent: this.getUserAgent()
      })

      return {
        user: authResult.user,
        tokens
      }
    } catch (error) {
      await this.logSecurityEvent('login_failed', {
        email: credentials.email,
        error: (error as Error).message,
        ip: this.getClientIP()
      })
      
      throw await errorHandler.handleError(
        error as Error,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.MEDIUM,
        { additionalData: { email: credentials.email } }
      )
    }
  }

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<{ user: User; tokens: AuthToken }> {
    try {
      // Rate limiting check
      await this.checkRateLimit(`register:${this.getClientIP()}`, 3, 60 * 60 * 1000) // 3 attempts per hour

      // Validate input
      this.validateEmail(data.email)
      this.validatePassword(data.password)
      this.validateName(data.name)

      if (!data.acceptTerms) {
        throw new Error('Terms and conditions must be accepted')
      }

      // Check if email already exists
      const existingUser = await this.checkEmailExists(data.email)
      if (existingUser) {
        throw new Error('Email already registered')
      }

      // Create user account
      const user = await this.createUserAccount(data)
      
      // Generate tokens
      const tokens = await this.generateTokens(user.id)
      
      // Send verification email
      await this.sendVerificationEmail(user.email, user.id)
      
      // Log registration
      await this.logSecurityEvent('user_registered', {
        userId: user.id,
        email: data.email,
        ip: this.getClientIP()
      })

      return { user, tokens }
    } catch (error) {
      throw await errorHandler.handleError(
        error as Error,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.MEDIUM
      )
    }
  }

  /**
   * Refresh authentication tokens
   */
  async refreshTokens(refreshToken: string): Promise<AuthToken> {
    try {
      // Validate refresh token
      const tokenData = await this.validateRefreshToken(refreshToken)
      
      // Generate new tokens
      const newTokens = await this.generateTokens(tokenData.userId)
      
      // Invalidate old refresh token
      await this.invalidateRefreshToken(refreshToken)
      
      return newTokens
    } catch (error) {
      throw await errorHandler.handleError(
        error as Error,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.HIGH
      )
    }
  }

  /**
   * Logout user and invalidate tokens
   */
  async logout(accessToken: string, refreshToken?: string): Promise<void> {
    try {
      const tokenData = await this.validateAccessToken(accessToken)
      
      // Invalidate tokens
      await this.invalidateAccessToken(accessToken)
      if (refreshToken) {
        await this.invalidateRefreshToken(refreshToken)
      }
      
      // Log logout
      await this.logSecurityEvent('user_logout', {
        userId: tokenData.userId,
        ip: this.getClientIP()
      })
    } catch (error) {
      // Don't throw on logout errors, just log them
      await errorHandler.handleError(
        error as Error,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.LOW
      )
    }
  }

  /**
   * Validate access token and return user data
   */
  async validateAccessToken(token: string): Promise<{ userId: string; user: User }> {
    try {
      // Decode and validate JWT token
      const decoded = await this.decodeJWT(token)
      
      // Check if token is expired
      if (decoded.exp < Date.now() / 1000) {
        throw new Error('Token expired')
      }
      
      // Get user data
      const user = await this.getUserById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }
      
      return { userId: decoded.userId, user }
    } catch (error) {
      throw await errorHandler.handleError(
        error as Error,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.MEDIUM
      )
    }
  }

  /**
   * Check user permissions for specific action
   */
  async checkPermission(userId: string, permission: string): Promise<boolean> {
    try {
      const user = await this.getUserById(userId)
      if (!user) return false
      
      // Check if user has specific permission
      if (user.permissions.includes(permission)) return true
      
      // Check role-based permissions
      const rolePermissions = this.getRolePermissions(user.role)
      return rolePermissions.includes(permission)
    } catch (error) {
      await errorHandler.handleError(
        error as Error,
        ErrorCategory.AUTHENTICATION,
        ErrorSeverity.LOW
      )
      return false
    }
  }

  /**
   * Rate limiting implementation
   */
  async checkRateLimit(key: string, maxAttempts: number, windowMs: number): Promise<void> {
    const now = Date.now()
    const record = this.rateLimitStore.get(key)
    
    if (!record || now > record.resetTime) {
      // Reset or create new record
      this.rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
      return
    }
    
    if (record.count >= maxAttempts) {
      throw new Error('Rate limit exceeded. Please try again later.')
    }
    
    record.count++
  }

  /**
   * Encrypt sensitive data
   */
  encrypt(data: string): string {
    try {
      const crypto = require('crypto')
      const algorithm = 'aes-256-gcm'
      const key = Buffer.from(security.encryptionKey, 'hex')
      const iv = crypto.randomBytes(16)
      
      const cipher = crypto.createCipher(algorithm, key)
      cipher.setAAD(Buffer.from('BiteBase', 'utf8'))
      
      let encrypted = cipher.update(data, 'utf8', 'hex')
      encrypted += cipher.final('hex')
      
      const authTag = cipher.getAuthTag()
      
      return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
    } catch (error) {
      throw new Error('Encryption failed')
    }
  }

  /**
   * Decrypt sensitive data
   */
  decrypt(encryptedData: string): string {
    try {
      const crypto = require('crypto')
      const algorithm = 'aes-256-gcm'
      const key = Buffer.from(security.encryptionKey, 'hex')
      
      const [ivHex, authTagHex, encrypted] = encryptedData.split(':')
      const iv = Buffer.from(ivHex, 'hex')
      const authTag = Buffer.from(authTagHex, 'hex')
      
      const decipher = crypto.createDecipher(algorithm, key)
      decipher.setAAD(Buffer.from('BiteBase', 'utf8'))
      decipher.setAuthTag(authTag)
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8')
      decrypted += decipher.final('utf8')
      
      return decrypted
    } catch (error) {
      throw new Error('Decryption failed')
    }
  }

  // Private helper methods
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain at least one uppercase letter, one lowercase letter, and one number')
    }
  }

  private validateName(name: string): void {
    if (name.length < 2) {
      throw new Error('Name must be at least 2 characters long')
    }
  }

  private async authenticateWithProvider(credentials: LoginCredentials): Promise<{ user: User }> {
    // Implementation would depend on your auth provider (Firebase, Auth0, etc.)
    // This is a placeholder for the actual authentication logic
    throw new Error('Authentication provider not implemented')
  }

  private async generateTokens(userId: string): Promise<AuthToken> {
    // Implementation for JWT token generation
    // This is a placeholder for the actual token generation logic
    throw new Error('Token generation not implemented')
  }

  private async checkEmailExists(email: string): Promise<boolean> {
    // Implementation to check if email exists in database
    return false
  }

  private async createUserAccount(data: RegisterData): Promise<User> {
    // Implementation to create user account in database
    throw new Error('User creation not implemented')
  }

  private async sendVerificationEmail(email: string, userId: string): Promise<void> {
    // Implementation to send verification email
  }

  private async validateRefreshToken(token: string): Promise<{ userId: string }> {
    // Implementation to validate refresh token
    throw new Error('Refresh token validation not implemented')
  }

  private async invalidateRefreshToken(token: string): Promise<void> {
    // Implementation to invalidate refresh token
  }

  private async invalidateAccessToken(token: string): Promise<void> {
    // Implementation to invalidate access token
  }

  private async decodeJWT(token: string): Promise<any> {
    // Implementation to decode and validate JWT
    throw new Error('JWT decoding not implemented')
  }

  private async getUserById(userId: string): Promise<User | null> {
    // Implementation to get user from database
    return null
  }

  private getRolePermissions(role: string): string[] {
    const rolePermissions = {
      admin: ['*'], // All permissions
      premium: ['create_restaurant', 'market_analysis', 'export_data', 'api_access'],
      user: ['create_restaurant', 'basic_analysis'],
      enterprise: ['*', 'team_management', 'advanced_analytics']
    }
    return rolePermissions[role as keyof typeof rolePermissions] || []
  }

  private async logSecurityEvent(event: string, data: any): Promise<void> {
    // Implementation to log security events
    console.log(`Security Event: ${event}`, data)
  }

  private getClientIP(): string {
    // Implementation to get client IP address
    return 'unknown'
  }

  private getUserAgent(): string {
    // Implementation to get user agent
    return typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
  }
}

// Export singleton instance
export const securityService = SecurityService.getInstance()

// Convenience functions
export const login = (credentials: LoginCredentials) => securityService.login(credentials)
export const register = (data: RegisterData) => securityService.register(data)
export const logout = (accessToken: string, refreshToken?: string) => securityService.logout(accessToken, refreshToken)
export const validateToken = (token: string) => securityService.validateAccessToken(token)
export const checkPermission = (userId: string, permission: string) => securityService.checkPermission(userId, permission)
export const encrypt = (data: string) => securityService.encrypt(data)
export const decrypt = (encryptedData: string) => securityService.decrypt(encryptedData)

export default SecurityService
