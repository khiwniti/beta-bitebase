/**
 * Production-Ready SEO and Metadata Service
 * 
 * This module provides comprehensive SEO optimization,
 * metadata management, and structured data for better search visibility.
 */

import { app } from '../../config/production'

export interface SEOMetadata {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogType?: 'website' | 'article' | 'product' | 'profile'
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  robots?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
  section?: string
  tags?: string[]
}

export interface StructuredData {
  '@context': string
  '@type': string
  [key: string]: any
}

export interface BreadcrumbItem {
  name: string
  url: string
}

class SEOService {
  private static instance: SEOService
  private defaultMetadata: SEOMetadata

  private constructor() {
    this.defaultMetadata = {
      title: 'BiteBase Intelligence - AI-Powered Restaurant Market Research',
      description: 'Transform your restaurant business with AI-powered market research, location intelligence, and competitive analysis. Make data-driven decisions for restaurant success.',
      keywords: [
        'restaurant market research',
        'restaurant location analysis',
        'food industry analytics',
        'restaurant business intelligence',
        'competitive analysis',
        'market opportunity',
        'restaurant AI',
        'food service analytics'
      ],
      ogType: 'website',
      twitterCard: 'summary_large_image',
      robots: 'index, follow',
      author: 'BiteBase Intelligence Team'
    }
  }

  public static getInstance(): SEOService {
    if (!SEOService.instance) {
      SEOService.instance = new SEOService()
    }
    return SEOService.instance
  }

  /**
   * Generate complete metadata for a page
   */
  generateMetadata(pageMetadata: Partial<SEOMetadata> = {}): SEOMetadata {
    const metadata = { ...this.defaultMetadata, ...pageMetadata }
    
    // Auto-generate Open Graph data if not provided
    if (!metadata.ogTitle) metadata.ogTitle = metadata.title
    if (!metadata.ogDescription) metadata.ogDescription = metadata.description
    if (!metadata.ogImage) metadata.ogImage = `${app.url}/images/og-default.jpg`
    
    // Auto-generate Twitter data if not provided
    if (!metadata.twitterTitle) metadata.twitterTitle = metadata.title
    if (!metadata.twitterDescription) metadata.twitterDescription = metadata.description
    if (!metadata.twitterImage) metadata.twitterImage = metadata.ogImage
    
    // Set canonical URL if not provided
    if (!metadata.canonical && typeof window !== 'undefined') {
      metadata.canonical = window.location.href
    }
    
    return metadata
  }

  /**
   * Generate structured data for organization
   */
  generateOrganizationStructuredData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'BiteBase Intelligence',
      url: app.url,
      logo: `${app.url}/images/logo.png`,
      description: 'AI-powered restaurant market research and business intelligence platform',
      foundingDate: '2024',
      industry: 'Food Service Technology',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+1-555-BITEBASE',
        contactType: 'Customer Service',
        email: app.supportEmail
      },
      sameAs: [
        'https://twitter.com/bitebase',
        'https://linkedin.com/company/bitebase',
        'https://facebook.com/bitebase'
      ],
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'US',
        addressRegion: 'CA',
        addressLocality: 'San Francisco'
      }
    }
  }

  /**
   * Generate structured data for software application
   */
  generateSoftwareApplicationStructuredData(): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'BiteBase Intelligence',
      description: 'AI-powered restaurant market research and business intelligence platform',
      url: app.url,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        description: 'Free tier available with premium plans starting at $29/month'
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        ratingCount: '1250',
        bestRating: '5',
        worstRating: '1'
      },
      author: {
        '@type': 'Organization',
        name: 'BiteBase Intelligence'
      }
    }
  }

  /**
   * Generate structured data for article/blog post
   */
  generateArticleStructuredData(article: {
    title: string
    description: string
    author: string
    publishedDate: string
    modifiedDate?: string
    image?: string
    url: string
  }): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.description,
      image: article.image || `${app.url}/images/og-default.jpg`,
      url: article.url,
      datePublished: article.publishedDate,
      dateModified: article.modifiedDate || article.publishedDate,
      author: {
        '@type': 'Person',
        name: article.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'BiteBase Intelligence',
        logo: {
          '@type': 'ImageObject',
          url: `${app.url}/images/logo.png`
        }
      }
    }
  }

  /**
   * Generate breadcrumb structured data
   */
  generateBreadcrumbStructuredData(breadcrumbs: BreadcrumbItem[]): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    }
  }

  /**
   * Generate FAQ structured data
   */
  generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>): StructuredData {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    }
  }

  /**
   * Generate local business structured data for restaurant clients
   */
  generateLocalBusinessStructuredData(business: {
    name: string
    description: string
    address: string
    phone: string
    website?: string
    cuisine: string[]
    priceRange: string
    rating?: number
    reviewCount?: number
    latitude: number
    longitude: number
    hours?: Array<{ day: string; open: string; close: string }>
  }): StructuredData {
    const structuredData: StructuredData = {
      '@context': 'https://schema.org',
      '@type': 'Restaurant',
      name: business.name,
      description: business.description,
      telephone: business.phone,
      url: business.website,
      priceRange: business.priceRange,
      servesCuisine: business.cuisine,
      address: {
        '@type': 'PostalAddress',
        streetAddress: business.address
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.latitude,
        longitude: business.longitude
      }
    }

    if (business.rating && business.reviewCount) {
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: business.rating,
        reviewCount: business.reviewCount,
        bestRating: 5,
        worstRating: 1
      }
    }

    if (business.hours) {
      structuredData.openingHours = business.hours.map(hour => 
        `${hour.day} ${hour.open}-${hour.close}`
      )
    }

    return structuredData
  }

  /**
   * Generate sitemap data
   */
  generateSitemapData(): Array<{
    url: string
    lastModified: string
    changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
    priority: number
  }> {
    const baseUrl = app.url
    const now = new Date().toISOString()

    return [
      {
        url: baseUrl,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 1.0
      },
      {
        url: `${baseUrl}/features`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/pricing`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/restaurant-setup`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.9
      },
      {
        url: `${baseUrl}/dashboard`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: 0.7
      },
      {
        url: `${baseUrl}/auth`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.6
      },
      {
        url: `${baseUrl}/blog`,
        lastModified: now,
        changeFrequency: 'weekly',
        priority: 0.7
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: now,
        changeFrequency: 'yearly',
        priority: 0.3
      }
    ]
  }

  /**
   * Generate robots.txt content
   */
  generateRobotsTxt(): string {
    const baseUrl = app.url
    
    return `User-agent: *
Allow: /

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /dashboard/private/

# Allow important pages
Allow: /
Allow: /features
Allow: /pricing
Allow: /restaurant-setup
Allow: /blog/

# Sitemap location
Sitemap: ${baseUrl}/sitemap.xml

# Crawl delay (optional)
Crawl-delay: 1`
  }

  /**
   * Optimize page title for SEO
   */
  optimizeTitle(title: string, includesBrand: boolean = false): string {
    const maxLength = 60
    const brandName = 'BiteBase Intelligence'
    
    let optimizedTitle = title.trim()
    
    if (!includesBrand && optimizedTitle.length + brandName.length + 3 <= maxLength) {
      optimizedTitle = `${optimizedTitle} | ${brandName}`
    }
    
    if (optimizedTitle.length > maxLength) {
      optimizedTitle = optimizedTitle.substring(0, maxLength - 3) + '...'
    }
    
    return optimizedTitle
  }

  /**
   * Optimize meta description for SEO
   */
  optimizeDescription(description: string): string {
    const maxLength = 160
    
    let optimizedDescription = description.trim()
    
    if (optimizedDescription.length > maxLength) {
      optimizedDescription = optimizedDescription.substring(0, maxLength - 3) + '...'
    }
    
    return optimizedDescription
  }

  /**
   * Generate canonical URL
   */
  generateCanonicalUrl(path: string): string {
    const baseUrl = app.url.replace(/\/$/, '') // Remove trailing slash
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    
    return `${baseUrl}${cleanPath}`
  }

  /**
   * Generate hreflang tags for international SEO
   */
  generateHreflangTags(currentPath: string): Array<{ hreflang: string; href: string }> {
    const baseUrl = app.url
    const languages = [
      { code: 'en', region: 'us' },
      { code: 'es', region: 'es' },
      { code: 'fr', region: 'fr' },
      { code: 'de', region: 'de' },
      { code: 'ja', region: 'jp' },
      { code: 'zh', region: 'cn' }
    ]
    
    return languages.map(lang => ({
      hreflang: `${lang.code}-${lang.region}`,
      href: `${baseUrl}/${lang.code}${currentPath}`
    }))
  }
}

// Export singleton instance
export const seoService = SEOService.getInstance()

// Convenience functions
export const generateMetadata = (pageMetadata?: Partial<SEOMetadata>) => 
  seoService.generateMetadata(pageMetadata)

export const generateOrganizationStructuredData = () => 
  seoService.generateOrganizationStructuredData()

export const generateSoftwareApplicationStructuredData = () => 
  seoService.generateSoftwareApplicationStructuredData()

export const generateArticleStructuredData = (article: any) => 
  seoService.generateArticleStructuredData(article)

export const generateBreadcrumbStructuredData = (breadcrumbs: BreadcrumbItem[]) => 
  seoService.generateBreadcrumbStructuredData(breadcrumbs)

export const generateFAQStructuredData = (faqs: Array<{ question: string; answer: string }>) => 
  seoService.generateFAQStructuredData(faqs)

export const generateLocalBusinessStructuredData = (business: any) => 
  seoService.generateLocalBusinessStructuredData(business)

export const optimizeTitle = (title: string, includesBrand?: boolean) => 
  seoService.optimizeTitle(title, includesBrand)

export const optimizeDescription = (description: string) => 
  seoService.optimizeDescription(description)

export const generateCanonicalUrl = (path: string) => 
  seoService.generateCanonicalUrl(path)

export default SEOService
