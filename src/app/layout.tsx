import { AuthInitializer } from "@/components/layout/auth-initializer";
import { GlobalErrorBoundary } from "@/components/layout/global-error-boundary";
import { ProgressBar } from "@/components/layout/progress-bar";
import { ServiceWorkerRegister } from "@/components/layout/service-worker-register";
import { Toaster } from "@/components/ui/sonner";
import { VibeKanbanWrapper } from "@/components/layout/vibe-kanban-wrapper";
import { QueryProvider } from "@/providers/query-provider";
import type { Metadata } from "next";
import "./globals.css";
import { WebVitals } from "./web-vitals";

export const metadata: Metadata = {
  title: {
    default: "Kafkasder Yönetim Paneli",
    template: "%s | Kafkasder",
  },
  description:
    "Kafkas Göçmenleri Derneği Yönetim Sistemi - Bağış, Üye ve Sosyal Yardım Yönetimi",
  keywords: [
    "dernek",
    "yönetim",
    "bağış",
    "sosyal yardım",
    "kafkasder",
    "üye takip",
  ],
  authors: [{ name: "Kafkasder" }],
  creator: "Kafkasder",
  publisher: "Kafkasder",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),
  openGraph: {
    title: "Kafkasder Yönetim Paneli",
    description: "Kafkas Göçmenleri Derneği Yönetim Sistemi",
    type: "website",
    locale: "tr_TR",
  },
  robots: {
    index: false, // Dashboard sayfaları indexlenmemeli
    follow: false,
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Kafkasder Panel",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="antialiased">
        {/* Skip to main content link - Accessibility */}
        <a
          href="#main-content"
          className="skip-link"
          aria-label="Ana içeriğe atla"
        >
          Ana içeriğe atla
        </a>
        <WebVitals />
        <ServiceWorkerRegister />
        <QueryProvider>
          <GlobalErrorBoundary>
            <ProgressBar />
            <AuthInitializer />
            {children}
            <Toaster position="top-right" richColors closeButton />
            <VibeKanbanWrapper />
          </GlobalErrorBoundary>
        </QueryProvider>
      </body>
    </html>
  );
}
