import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { InventoryProvider } from "@/context/InventoryContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SasthaSoft InventoCore | Enterprise Inventory & Supply Chain Suite",
  description:
    "Modern, connected full-stack inventory management web application with real-time stock deductions, automated restock receipts, threshold alerts, and multi-facility tracking.",
  authors: [{ name: "Khushi", url: "https://www.myselfkhushi.dev/" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F8F6F5] text-[#1C2727] transition-colors duration-150">
        <InventoryProvider>{children}</InventoryProvider>
      </body>
    </html>
  );
}
