'use client';

import { UnifiedDashboardLayout } from "../../../../components/layout/UnifiedDashboardLayout";

export default function MarketAnalysisTemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedDashboardLayout
      title="Analysis Templates"
      description="Use pre-configured templates to quickly create market analyses"
    >
      {children}
    </UnifiedDashboardLayout>
  );
}
