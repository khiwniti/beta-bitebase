'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export function BangkokSetupButton() {
  return (
    <Link
      href="/onboarding/bangkok-setup"
      className="block w-full bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-4 shadow-md hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-full">
          <MapPin className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-medium">Bangkok Restaurant Setup</h3>
          <p className="text-sm text-white/80">Configure your restaurant for the Bangkok market</p>
        </div>
      </div>
    </Link>
  );
}
