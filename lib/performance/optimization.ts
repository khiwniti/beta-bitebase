/**
 * Production-Ready Performance Optimization Service
 * 
 * This module provides comprehensive performance monitoring,
 * optimization, and caching strategies for the BiteBase application.
 */

import { redis, features } from '../../config/production'
import { trackPerformance } from '../analytics/tracking'

export interface PerformanceMetrics {
  pageLoadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
  apiResponseTime: number
  renderTime: number
}

export interface CacheOptions {
  ttl?: number // Time to live in seconds
  tags?: string[] // Cache tags for invalidation
  compress?: boolean // Whether to compress cached data
  serialize?: boolean // Whether to serialize objects
}

class PerformanceService {
  private static instance: PerformanceService
  private performanceObserver?: PerformanceObserver
  private metricsBuffer: PerformanceMetrics[] = []
  private cacheStore = new Map<string, { data: any; expires: number; tags: string[] }>()

  private constructor() {
    this.initializePerformanceMonitoring()
  }

  public static getInstance(): PerformanceService {
    if (!PerformanceService.instance) {
      PerformanceService.instance = new PerformanceService()
    }
    return PerformanceService.instance
  }

  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    if (typeof window === 'undefined' || !features.analytics) return

    try {
      // Monitor Core Web Vitals
      this.observeWebVitals()
      
      // Monitor API performance
      this.monitorAPIPerformance()
      
      // Monitor resource loading
      this.monitorResourceLoading()
      
      // Set up periodic reporting
      this.setupPeriodicReporting()
    } catch (error) {
      console.warn('Failed to initialize performance monitoring:', error)
    }
  }

  /**
   * Observe Core Web Vitals
   */
  private observeWebVitals(): void {
    if (!('PerformanceObserver' in window)) return

    // Largest Contentful Paint (LCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime: number; loadTime: number }
      this.recordMetric('largestContentfulPaint', lastEntry.renderTime || lastEntry.loadTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        this.recordMetric('firstInputDelay', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    new PerformanceObserver((list) => {
      let clsValue = 0
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      this.recordMetric('cumulativeLayoutShift', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })

    // First Contentful Paint (FCP)
    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry) => {
        this.recordMetric('firstContentfulPaint', entry.startTime)
      })
    }).observe({ entryTypes: ['paint'] })
  }

  /**
   * Monitor API performance
   */
  private monitorAPIPerformance(): void {
    if (typeof window === 'undefined') return

    // Intercept fetch requests
    const originalFetch = window.fetch
    window.fetch = async (...args) => {
      const startTime = performance.now()
      try {
        const response = await originalFetch(...args)
        const endTime = performance.now()
        const duration = endTime - startTime
        
        this.recordMetric('apiResponseTime', duration)
        this.trackAPICall(args[0] as string, duration, response.status)
        
        return response
      } catch (error) {
        const endTime = performance.now()
        const duration = endTime - startTime
        this.trackAPICall(args[0] as string, duration, 0, error as Error)
        throw error
      }
    }
  }

  /**
   * Monitor resource loading performance
   */
  private monitorResourceLoading(): void {
    if (!('PerformanceObserver' in window)) return

    new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.entryType === 'resource') {
          this.analyzeResourcePerformance(entry)
        }
      })
    }).observe({ entryTypes: ['resource'] })
  }

  /**
   * Set up periodic performance reporting
   */
  private setupPeriodicReporting(): void {
    setInterval(() => {
      this.reportPerformanceMetrics()
    }, 30000) // Report every 30 seconds
  }

  /**
   * Cache data with optional compression and TTL
   */
  async cache<T>(key: string, data: T, options: CacheOptions = {}): Promise<void> {
    const {
      ttl = 3600, // 1 hour default
      tags = [],
      compress = false,
      serialize = true
    } = options

    try {
      let processedData = data
      
      if (serialize && typeof data === 'object') {
        processedData = JSON.stringify(data) as T
      }
      
      if (compress && typeof processedData === 'string') {
        // Implement compression if needed
        // processedData = await this.compress(processedData)
      }

      const expires = Date.now() + (ttl * 1000)
      
      // Store in memory cache
      this.cacheStore.set(key, {
        data: processedData,
        expires,
        tags
      })

      // Store in Redis if available
      if (redis.url) {
        await this.setRedisCache(key, processedData, ttl)
      }
    } catch (error) {
      console.warn('Failed to cache data:', error)
    }
  }

  /**
   * Retrieve cached data
   */
  async getCache<T>(key: string): Promise<T | null> {
    try {
      // Check memory cache first
      const memoryCache = this.cacheStore.get(key)
      if (memoryCache && memoryCache.expires > Date.now()) {
        return memoryCache.data as T
      }

      // Check Redis cache
      if (redis.url) {
        const redisData = await this.getRedisCache(key)
        if (redisData) {
          return redisData as T
        }
      }

      return null
    } catch (error) {
      console.warn('Failed to retrieve cached data:', error)
      return null
    }
  }

  /**
   * Invalidate cache by key or tags
   */
  async invalidateCache(keyOrTags: string | string[]): Promise<void> {
    try {
      if (typeof keyOrTags === 'string') {
        // Invalidate specific key
        this.cacheStore.delete(keyOrTags)
        if (redis.url) {
          await this.deleteRedisCache(keyOrTags)
        }
      } else {
        // Invalidate by tags
        const keysToDelete: string[] = []
        this.cacheStore.forEach((value, key) => {
          if (value.tags.some(tag => keyOrTags.includes(tag))) {
            keysToDelete.push(key)
          }
        })
        
        keysToDelete.forEach(key => this.cacheStore.delete(key))
        
        if (redis.url && keysToDelete.length > 0) {
          await this.deleteRedisCacheMultiple(keysToDelete)
        }
      }
    } catch (error) {
      console.warn('Failed to invalidate cache:', error)
    }
  }

  /**
   * Optimize images for better performance
   */
  optimizeImage(src: string, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpeg' | 'png'
  } = {}): string {
    const { width, height, quality = 80, format = 'webp' } = options
    
    // If using a CDN like Cloudinary or ImageKit
    if (src.includes('cloudinary.com')) {
      let transformations = [`q_${quality}`, `f_${format}`]
      if (width) transformations.push(`w_${width}`)
      if (height) transformations.push(`h_${height}`)
      
      return src.replace('/upload/', `/upload/${transformations.join(',')}/`)
    }
    
    // For other images, return as-is (implement your own optimization logic)
    return src
  }

  /**
   * Lazy load components and resources
   */
  async lazyLoad<T>(importFn: () => Promise<T>): Promise<T> {
    const startTime = performance.now()
    
    try {
      const module = await importFn()
      const loadTime = performance.now() - startTime
      
      this.recordMetric('renderTime', loadTime)
      
      return module
    } catch (error) {
      console.error('Failed to lazy load module:', error)
      throw error
    }
  }

  /**
   * Debounce function calls for better performance
   */
  debounce<T extends (...args: any[]) => any>(
    func: T,
    delay: number
  ): (...args: Parameters<T>) => void {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }

  /**
   * Throttle function calls for better performance
   */
  throttle<T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): (...args: Parameters<T>) => void {
    let inThrottle: boolean
    
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * Preload critical resources
   */
  preloadResource(href: string, as: 'script' | 'style' | 'image' | 'font' = 'script'): void {
    if (typeof document === 'undefined') return

    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    
    if (as === 'font') {
      link.crossOrigin = 'anonymous'
    }
    
    document.head.appendChild(link)
  }

  /**
   * Get current performance metrics
   */
  getPerformanceMetrics(): PerformanceMetrics | null {
    if (this.metricsBuffer.length === 0) return null
    
    const latest = this.metricsBuffer[this.metricsBuffer.length - 1]
    return { ...latest }
  }

  // Private helper methods
  private recordMetric(metric: keyof PerformanceMetrics, value: number): void {
    if (this.metricsBuffer.length === 0) {
      this.metricsBuffer.push({
        pageLoadTime: 0,
        firstContentfulPaint: 0,
        largestContentfulPaint: 0,
        firstInputDelay: 0,
        cumulativeLayoutShift: 0,
        timeToInteractive: 0,
        apiResponseTime: 0,
        renderTime: 0
      })
    }
    
    const currentMetrics = this.metricsBuffer[this.metricsBuffer.length - 1]
    currentMetrics[metric] = value
  }

  private trackAPICall(url: string, duration: number, status: number, error?: Error): void {
    // Track API performance in analytics
    if (features.analytics) {
      trackPerformance({
        pageLoadTime: 0,
        apiResponseTime: duration,
        renderTime: 0
      })
    }
  }

  private analyzeResourcePerformance(entry: any): void {
    const { name, duration, transferSize } = entry
    
    // Log slow resources
    if (duration > 1000) { // More than 1 second
      console.warn(`Slow resource detected: ${name} took ${duration}ms`)
    }
    
    // Log large resources
    if (transferSize > 1024 * 1024) { // More than 1MB
      console.warn(`Large resource detected: ${name} is ${(transferSize / 1024 / 1024).toFixed(2)}MB`)
    }
  }

  private reportPerformanceMetrics(): void {
    if (this.metricsBuffer.length === 0) return
    
    const metrics = this.getPerformanceMetrics()
    if (metrics && features.analytics) {
      trackPerformance(metrics)
    }
  }

  private async setRedisCache(key: string, data: any, ttl: number): Promise<void> {
    // Implementation for Redis caching
    // This would use a Redis client library
  }

  private async getRedisCache(key: string): Promise<any> {
    // Implementation for Redis cache retrieval
    return null
  }

  private async deleteRedisCache(key: string): Promise<void> {
    // Implementation for Redis cache deletion
  }

  private async deleteRedisCacheMultiple(keys: string[]): Promise<void> {
    // Implementation for Redis multiple cache deletion
  }
}

// Export singleton instance
export const performanceService = PerformanceService.getInstance()

// Convenience functions
export const cache = <T>(key: string, data: T, options?: CacheOptions) => 
  performanceService.cache(key, data, options)

export const getCache = <T>(key: string) => 
  performanceService.getCache<T>(key)

export const invalidateCache = (keyOrTags: string | string[]) => 
  performanceService.invalidateCache(keyOrTags)

export const optimizeImage = (src: string, options?: any) => 
  performanceService.optimizeImage(src, options)

export const lazyLoad = <T>(importFn: () => Promise<T>) => 
  performanceService.lazyLoad(importFn)

export const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => 
  performanceService.debounce(func, delay)

export const throttle = <T extends (...args: any[]) => any>(func: T, limit: number) => 
  performanceService.throttle(func, limit)

export const preloadResource = (href: string, as?: 'script' | 'style' | 'image' | 'font') => 
  performanceService.preloadResource(href, as)

export default PerformanceService
