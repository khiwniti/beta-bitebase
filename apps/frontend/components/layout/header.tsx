"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Menu, 
  HelpCircle,
  MessageSquare,
  Calendar,
  User
} from 'lucide-react'
import BiteBaseLogo from '../BiteBaseLogo'
import { Button } from "@bitebase/ui"

interface HeaderProps {
  onOpenSidebar: () => void
  userName?: string
  restaurantName?: string
}

export function Header({ onOpenSidebar, userName = 'Restaurant Manager', restaurantName = 'Your Restaurant' }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()
  const [showUserMenu, setShowUserMenu] = useState(false)
  
  // Check if page is dashboard or analytics to show specific header actions
  const isAnalyticsPage = pathname?.includes('/market-analysis') || pathname?.includes('/place')
  const isDashboard = pathname === '/dashboard'
  
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-16 px-4 flex items-center justify-between">
        {/* Left section - Mobile menu toggle and branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenSidebar}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="hidden md:flex items-center gap-3">
            <BiteBaseLogo size="xs" />
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{restaurantName}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Culinary Intelligence Platform</p>
            </div>
          </div>
        </div>

        {/* Center section - Search */}
        <div className={`${searchOpen ? 'flex' : 'hidden md:flex'} flex-1 mx-4 lg:mx-8 max-w-lg`}>
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
            type="search"
              placeholder="Search competitors, locations, insights..."
              className="w-full py-2 pl-10 pr-3 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-600 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-3 flex items-center">
              <kbd className="hidden sm:inline-flex items-center px-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded">⌘K</kbd>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Mobile search toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label={searchOpen ? 'Close search' : 'Open search'}
          >
            <Search className="h-5 w-5" />
          </button>
          
          {/* Help button */}
          <button 
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Help and resources"
          >
            <HelpCircle className="h-5 w-5" />
          </button>
          
          {/* Calendar */}
          <Link
            href="/calendar"
            className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Calendar and events"
          >
            <Calendar className="h-5 w-5" />
          </Link>
          
          {/* Messages */}
          <Link
            href="/messages"
            className="hidden sm:flex p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            aria-label="Messages"
          >
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary-500"></span>
          </Link>
          
          {/* Notifications */}
          <Link
            href="/notifications"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
          </Link>
          
          {/* Actions button - context-aware */}
          {(isAnalyticsPage || isDashboard) && (
            <div className="hidden md:block">
              <Button 
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm"
                size="sm"
              >
                {isAnalyticsPage ? 'Generate Report' : 'Add Location'}
              </Button>
            </div>
          )}
          
          {/* User profile dropdown */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200"
              aria-label="User menu"
              aria-expanded={showUserMenu}
            >
              <div className="relative">
                <div className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-700 dark:text-primary-300 font-medium">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </div>
              <span className="hidden lg:inline-block font-medium text-sm">{userName}</span>
              <ChevronDown className="h-4 w-4 text-gray-400 hidden lg:inline-block" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 py-2 animate-fadeInUp origin-top-right">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="font-medium text-sm text-gray-900 dark:text-white">{userName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{restaurantName}</p>
      </div>

                <div className="py-2">
                  <Link
                    href="/settings/profile" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <User className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" />
                    Your Profile
                  </Link>
                  <Link
                    href="/settings/restaurant" 
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 12V8C22 6.9 21.1 6 20 6H4C2.9 6 2 6.9 2 8V16C2 17.1 2.9 18 4 18H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 10H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M9 14H9.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="2" />
                      <path d="M22 21L19 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Restaurant Settings
                  </Link>
                  <Link
                    href="/subscription"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg className="w-4 h-4 mr-3 text-gray-400 dark:text-gray-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M1 10H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Subscription & Billing
                  </Link>
                </div>
                
                <div className="py-2 border-t border-gray-100 dark:border-gray-800">
                  <Link
                    href="/auth/signout" 
                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sign Out
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
