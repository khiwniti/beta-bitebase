'use client';

import { MainLayout } from "../../components/layout/MainLayout";

export default function PriceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      pageTitle="Price Strategy"
      pageDescription="Optimize your pricing for maximum profitability"
    >
      {children}
    </MainLayout>
  );
}
