'use client';

import { UnifiedDashboardLayout } from "../../../components/layout/UnifiedDashboardLayout";

export default function MarketAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedDashboardLayout
      title="Market Analysis"
      description="Analyze market trends and customer behavior"
    >
      {children}
    </UnifiedDashboardLayout>
  );
}
