'use client';

import { UnifiedDashboardLayout } from "../../../components/layout/UnifiedDashboardLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedDashboardLayout
      title="Restaurant Intelligence Dashboard"
      description="Welcome to your restaurant intelligence platform"
    >
      {children}
    </UnifiedDashboardLayout>
  );
}
