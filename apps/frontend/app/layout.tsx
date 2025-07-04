import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "SiteWatch",
  description: "Monitor your websites with confidence. Get instant alerts when something goes wrong.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {/* <ThemeProviderWrapper>{children}</ThemeProviderWrapper> */}
       {children}
      </body>
    </html>
  );
}
