'use client';

import { MainLayout } from "../../components/layout/MainLayout";

export default function PlaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MainLayout
      pageTitle="Place Analysis"
      pageDescription="Location intelligence for your restaurant business"
    >
      {children}
    </MainLayout>
  );
}
