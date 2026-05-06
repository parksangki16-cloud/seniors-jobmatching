import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "상상우리 — 시니어 일자리 매칭",
  description: "시니어와 일자리를 자동으로 연결합니다",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gray-50">
        <header className="bg-blue-700 text-white shadow-md">
          <nav className="max-w-5xl mx-auto flex items-center gap-8 px-6 py-4">
            <span className="text-2xl font-bold tracking-tight">상상우리</span>
            <Link
              href="/register"
              className="text-xl font-medium hover:underline underline-offset-4"
            >
              프로필 등록
            </Link>
            <Link
              href="/recommendations"
              className="text-xl font-medium hover:underline underline-offset-4"
            >
              추천 일자리
            </Link>
            <Link
              href="/admin"
              className="text-xl font-medium hover:underline underline-offset-4"
            >
              담당자 대시보드
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="bg-gray-200 text-gray-600 text-center py-4 text-lg">
          © 2025 상상우리. 시니어와 일자리를 잇습니다.
        </footer>
      </body>
    </html>
  );
}
