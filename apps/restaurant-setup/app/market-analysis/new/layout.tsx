'use client';

import { UnifiedDashboardLayout } from "../../../../components/layout/UnifiedDashboardLayout";

export default function NewMarketAnalysisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnifiedDashboardLayout
      title="New Market Analysis"
      description="Create a new market analysis report"
    >
      {children}
    </UnifiedDashboardLayout>
  );
}
