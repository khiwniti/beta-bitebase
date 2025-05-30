'use client';

import { MainLayout } from "../../components/layout/MainLayout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      pageTitle="Dashboard"
      pageDescription="Market intelligence overview for your restaurant business"
      showNavbar={true}
      showWelcomeBanner={true}
    >
      {children}
    </MainLayout>
  );
}
