'use client';

import { MainLayout } from "../../components/layout/MainLayout";

export default function PromotionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      pageTitle="Promotion & Marketing"
      pageDescription="Manage your marketing campaigns and customer engagement"
    >
      {children}
    </MainLayout>
  );
}
