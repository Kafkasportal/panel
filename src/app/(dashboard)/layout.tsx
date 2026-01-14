"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import DashboardLoading from "./loading";

// Lazy load ProgressBar - sadece client'ta gerekli
const ProgressBar = dynamic(
  () =>
    import("@/components/layout/progress-bar").then((mod) => ({
      default: mod.ProgressBar,
    })),
  { ssr: false },
);

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProgressBar />
      <SidebarProvider
        style={
          {
            "--sidebar-width": "16rem",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <main
            id="main-content"
            role="main"
            tabIndex={-1}
            className="flex-1 overflow-y-auto p-4 lg:p-6 focus:outline-none"
            aria-label="Ana içerik"
          >
            <Suspense fallback={<DashboardLoading />}>{children}</Suspense>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
