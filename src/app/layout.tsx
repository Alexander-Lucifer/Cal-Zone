import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/clerk-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cal-Zone - Your Next-Gen Diet Companion",
  description: "Your intelligent diet companion that makes nutrition tracking effortless and enjoyable. Transform your health journey with smart insights and personalized guidance.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`} suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
