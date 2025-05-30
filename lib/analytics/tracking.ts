/**
 * Production-Ready Analytics and Tracking System
 * 
 * This module provides comprehensive analytics tracking,
 * user behavior monitoring, and business intelligence.
 */

import { analytics, features } from '../../config/production'

export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp?: Date
}

export interface UserProperties {
  userId: string
  email?: string
  name?: string
  plan?: string
  signupDate?: Date
  lastActiveDate?: Date
  restaurantCount?: number
  location?: {
    country?: string
    city?: string
    timezone?: string
  }
}

export interface BusinessMetrics {
  restaurantSetups: number
  marketAnalyses: number
  activeUsers: number
  revenue: number
  churnRate: number
  conversionRate: number
}

class AnalyticsService {
  private static instance: AnalyticsService
  private initialized = false
  private sessionId: string
  private userId?: string

  private constructor() {
    this.sessionId = this.generateSessionId()
    this.initialize()
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  /**
   * Initialize analytics services
   */
  private async initialize(): Promise<void> {
    if (this.initialized || !features.analytics) {
      return
    }

    try {
      await Promise.all([
        this.initializeGoogleAnalytics(),
        this.initializeMixpanel(),
        this.initializeHotjar()
      ])
      
      this.initialized = true
      console.log('Analytics services initialized successfully')
    } catch (error) {
      console.warn('Failed to initialize analytics services:', error)
    }
  }

  /**
   * Initialize Google Analytics 4
   */
  private async initializeGoogleAnalytics(): Promise<void> {
    if (!analytics.googleAnalytics.id) return

    try {
      // Load Google Analytics script
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${analytics.googleAnalytics.id}`
      document.head.appendChild(script)

      // Initialize gtag
      window.dataLayer = window.dataLayer || []
      function gtag(...args: any[]) {
        window.dataLayer.push(args)
      }
      
      gtag('js', new Date())
      gtag('config', analytics.googleAnalytics.id, {
        page_title: document.title,
        page_location: window.location.href
      })

      // Make gtag globally available
      ;(window as any).gtag = gtag
    } catch (error) {
      console.warn('Failed to initialize Google Analytics:', error)
    }
  }

  /**
   * Initialize Mixpanel
   */
  private async initializeMixpanel(): Promise<void> {
    if (!analytics.mixpanel.token) return

    try {
      const mixpanel = await import('mixpanel-browser')
      mixpanel.init(analytics.mixpanel.token, {
        debug: process.env.NODE_ENV === 'development',
        track_pageview: true,
        persistence: 'localStorage'
      })
      
      ;(window as any).mixpanel = mixpanel
    } catch (error) {
      console.warn('Failed to initialize Mixpanel:', error)
    }
  }

  /**
   * Initialize Hotjar
   */
  private async initializeHotjar(): Promise<void> {
    if (!analytics.hotjar.id) return

    try {
      ;(function(h: any, o: any, t: any, j: any, a?: any, r?: any) {
        h.hj = h.hj || function(...args: any[]) { (h.hj.q = h.hj.q || []).push(args) }
        h._hjSettings = { hjid: analytics.hotjar.id, hjsv: 6 }
        a = o.getElementsByTagName('head')[0]
        r = o.createElement('script')
        r.async = 1
        r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
        a.appendChild(r)
      })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')
    } catch (error) {
      console.warn('Failed to initialize Hotjar:', error)
    }
  }

  /**
   * Track custom events
   */
  public track(event: AnalyticsEvent): void {
    if (!features.analytics) return

    const enrichedEvent = {
      ...event,
      sessionId: this.sessionId,
      userId: this.userId || event.userId,
      timestamp: event.timestamp || new Date(),
      properties: {
        ...event.properties,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent
      }
    }

    // Track in Google Analytics
    this.trackInGoogleAnalytics(enrichedEvent)
    
    // Track in Mixpanel
    this.trackInMixpanel(enrichedEvent)
    
    // Log for debugging
    if (process.env.NODE_ENV === 'development') {
      console.log('Analytics Event:', enrichedEvent)
    }
  }

  /**
   * Track page views
   */
  public trackPageView(path?: string, title?: string): void {
    if (!features.analytics) return

    const page = path || window.location.pathname
    const pageTitle = title || document.title

    this.track({
      name: 'page_view',
      properties: {
        page,
        title: pageTitle
      }
    })
  }

  /**
   * Identify user
   */
  public identify(userProperties: UserProperties): void {
    if (!features.analytics) return

    this.userId = userProperties.userId

    // Identify in Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('config', analytics.googleAnalytics.id, {
        user_id: userProperties.userId
      })
    }

    // Identify in Mixpanel
    if ((window as any).mixpanel) {
      (window as any).mixpanel.identify(userProperties.userId)
      (window as any).mixpanel.people.set(userProperties)
    }
  }

  /**
   * Track business-specific events
   */
  public trackRestaurantSetup(restaurantData: {
    name: string
    cuisine: string
    location: { lat: number; lng: number }
    setupStep: string
  }): void {
    this.track({
      name: 'restaurant_setup',
      properties: {
        restaurant_name: restaurantData.name,
        cuisine_type: restaurantData.cuisine,
        latitude: restaurantData.location.lat,
        longitude: restaurantData.location.lng,
        setup_step: restaurantData.setupStep
      }
    })
  }

  public trackMarketAnalysis(analysisData: {
    location: { lat: number; lng: number }
    radius: number
    competitorCount: number
    opportunityScore: number
  }): void {
    this.track({
      name: 'market_analysis',
      properties: {
        latitude: analysisData.location.lat,
        longitude: analysisData.location.lng,
        search_radius: analysisData.radius,
        competitor_count: analysisData.competitorCount,
        opportunity_score: analysisData.opportunityScore
      }
    })
  }

  public trackAIInteraction(interactionData: {
    type: 'chat' | 'recommendation' | 'analysis'
    query: string
    responseTime: number
    satisfaction?: number
  }): void {
    this.track({
      name: 'ai_interaction',
      properties: {
        interaction_type: interactionData.type,
        query_length: interactionData.query.length,
        response_time_ms: interactionData.responseTime,
        user_satisfaction: interactionData.satisfaction
      }
    })
  }

  public trackSubscription(subscriptionData: {
    plan: string
    action: 'subscribe' | 'upgrade' | 'downgrade' | 'cancel'
    amount?: number
  }): void {
    this.track({
      name: 'subscription_change',
      properties: {
        plan_name: subscriptionData.plan,
        action: subscriptionData.action,
        amount: subscriptionData.amount
      }
    })
  }

  /**
   * Track conversion funnel
   */
  public trackFunnelStep(step: string, properties?: Record<string, any>): void {
    this.track({
      name: 'funnel_step',
      properties: {
        step,
        ...properties
      }
    })
  }

  /**
   * Track errors for analytics
   */
  public trackError(error: {
    message: string
    category: string
    severity: string
    page: string
  }): void {
    this.track({
      name: 'error_occurred',
      properties: {
        error_message: error.message,
        error_category: error.category,
        error_severity: error.severity,
        error_page: error.page
      }
    })
  }

  /**
   * Track performance metrics
   */
  public trackPerformance(metrics: {
    pageLoadTime: number
    apiResponseTime: number
    renderTime: number
  }): void {
    this.track({
      name: 'performance_metrics',
      properties: {
        page_load_time: metrics.pageLoadTime,
        api_response_time: metrics.apiResponseTime,
        render_time: metrics.renderTime
      }
    })
  }

  /**
   * Get business metrics
   */
  public async getBusinessMetrics(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<BusinessMetrics> {
    // This would typically fetch from your analytics backend
    // For now, return mock data structure
    return {
      restaurantSetups: 0,
      marketAnalyses: 0,
      activeUsers: 0,
      revenue: 0,
      churnRate: 0,
      conversionRate: 0
    }
  }

  // Private helper methods
  private trackInGoogleAnalytics(event: AnalyticsEvent): void {
    if ((window as any).gtag) {
      (window as any).gtag('event', event.name, {
        event_category: 'engagement',
        event_label: event.name,
        custom_parameters: event.properties
      })
    }
  }

  private trackInMixpanel(event: AnalyticsEvent): void {
    if ((window as any).mixpanel) {
      (window as any).mixpanel.track(event.name, event.properties)
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

// Export singleton instance
export const analytics = AnalyticsService.getInstance()

// Convenience functions
export const track = (event: AnalyticsEvent) => analytics.track(event)
export const trackPageView = (path?: string, title?: string) => analytics.trackPageView(path, title)
export const identify = (userProperties: UserProperties) => analytics.identify(userProperties)
export const trackRestaurantSetup = (data: any) => analytics.trackRestaurantSetup(data)
export const trackMarketAnalysis = (data: any) => analytics.trackMarketAnalysis(data)
export const trackAIInteraction = (data: any) => analytics.trackAIInteraction(data)
export const trackSubscription = (data: any) => analytics.trackSubscription(data)
export const trackFunnelStep = (step: string, properties?: Record<string, any>) => analytics.trackFunnelStep(step, properties)
export const trackError = (error: any) => analytics.trackError(error)
export const trackPerformance = (metrics: any) => analytics.trackPerformance(metrics)

export default AnalyticsService

// Global type declarations
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
    mixpanel: any
    hj: any
  }
}
