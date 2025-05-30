'use client';

import { MainLayout } from "../../components/layout/MainLayout";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      pageTitle="Product Management"
      pageDescription="Manage your menu items and optimize your offerings"
    >
      {children}
    </MainLayout>
  );
}
