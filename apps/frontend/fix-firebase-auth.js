#!/usr/bin/env node
/**
 * Script to fix Firebase auth initialization issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting Firebase auth fix...');

try {
  // 1. Clean up build artifacts
  console.log('Cleaning build artifacts...');
  if (fs.existsSync('.next')) {
    execSync('rm -rf .next', { stdio: 'inherit' });
  }

  // 2. Install compatible Firebase version
  console.log('Installing compatible Firebase version...');
  execSync('npm install firebase@9.17.2 --save-exact', { stdio: 'inherit' });
  
  // 3. Install additional dependencies if needed
  console.log('Installing additional dependencies...');
  execSync('npm install --save-exact react@18.2.0 react-dom@18.2.0', { stdio: 'inherit' });
  
  // 4. Fix Firebase initialization
  console.log('Fixing Firebase initialization...');
  const firebaseContent = `// Firebase client setup with proper Next.js handling
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBoVa7LlMV9WZkS4TVgMx7SXTn_E2gjt0Q",
  authDomain: "bitebase-3d5f9.firebaseapp.com",
  projectId: "bitebase-3d5f9",
  storageBucket: "bitebase-3d5f9.firebasestorage.app",
  messagingSenderId: "869869191395",
  appId: "1:869869191395:web:0bb2821dfc368800e305d6",
  measurementId: "G-CB8TNELCRL"
};

// Initialize Firebase
let app = null;
let auth = null;
let db = null;

// Only initialize on client side
if (typeof window !== 'undefined') {
  try {
    // Check if Firebase app is already initialized
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    
    // Initialize auth and firestore
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Error initializing Firebase:', error);
  }
}

// Export with both naming conventions for backwards compatibility
export const firebase = app;
export const firebaseApp = app;
export const firebaseAuth = auth;
export const firebaseDb = db;
export { auth, db, app };`;

  // Write the fixed Firebase initialization
  fs.mkdirSync('./lib', { recursive: true });
  fs.writeFileSync('./lib/firebase.js', firebaseContent);

  // 5. Fix AuthContext
  console.log('Fixing AuthContext...');
  const authContextContent = `"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
// Import in a way that works with both naming conventions
import * as firebaseAuth from 'firebase/auth';
import { auth } from '../lib/firebase';

// Create auth context
const AuthContext = createContext({
  user: null,
  loading: true,
});

// Auth provider component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    // Skip if window is not defined (SSR)
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    let unsubscribe = () => {};
    
    const initAuth = () => {
      try {
        // Check if auth is available
        if (!auth) {
          console.error('Firebase auth is not initialized');
          setLoading(false);
          return;
        }
        
        unsubscribe = firebaseAuth.onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser({
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              photoURL: user.photoURL,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error('Error in auth state listener:', error);
        setLoading(false);
      }
    };
    
    // Small timeout to ensure Firebase is initialized
    setTimeout(initAuth, 100);
    
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth() {
  return useContext(AuthContext);
}`;

  // Write the fixed AuthContext
  fs.mkdirSync('./contexts', { recursive: true });
  fs.writeFileSync('./contexts/AuthContext.jsx', authContextContent);
  
  // 6. Update the app layout
  console.log('Updating layout...');
  const layoutContent = `import React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import dynamic from 'next/dynamic'

// Dynamically import AuthProvider with no SSR to avoid Firebase initialization issues
const AuthProvider = dynamic(
  () => import('../contexts/AuthContext').then(mod => ({ default: mod.AuthProvider })),
  { ssr: false }
)

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: "BiteBase Intelligence - AI-Powered Restaurant Business Intelligence",
  description: "Harness the power of AI to analyze markets, optimize locations, and outperform competitors with BiteBase Intelligence.",
  keywords: ["restaurant", "AI", "business intelligence", "market analysis", "location intelligence", "restaurant analytics"],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

// Error boundary to catch any errors in the auth provider
function SafeAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <React.Suspense fallback={<div>Loading authentication...</div>}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </React.Suspense>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className={\`\${poppins.className} antialiased bg-gray-50 overflow-x-hidden\`} style={{fontFamily: 'Poppins, sans-serif'}}>
        <SafeAuthProvider>
          {children}
        </SafeAuthProvider>
      </body>
    </html>
  )
}`;

  fs.writeFileSync('./app/layout.tsx', layoutContent);
  
  // 7. Fix auth page
  console.log('Updating auth page...');
  const authPageContent = `"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        throw new Error('Firebase auth is not initialized yet');
      }

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      router.push('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleAuth}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : null}
              {isLogin ? 'Sign in' : 'Sign up'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <button
            className="text-indigo-600 hover:text-indigo-800 text-sm"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;`;

  fs.mkdirSync('./app/auth', { recursive: true });
  fs.writeFileSync('./app/auth/page.jsx', authPageContent);

  // 8. Start the development server
  console.log('Fixed Firebase auth issues. Starting development server...');
  execSync('npm run dev', { stdio: 'inherit' });
} catch (error) {
  console.error('Error fixing Firebase auth:', error);
  process.exit(1);
} 