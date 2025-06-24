import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/toaster";
import BottomNav from "@/components/layout/bottom-nav";
import ViewportFix from "@/components/layout/viewport-fix";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "별빛 크리터 이야기",
  description: "나만의 작은 크리터들을 키워보세요!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <ViewportFix />
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow pt-16 pb-16">{children}</main>
          <BottomNav />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
