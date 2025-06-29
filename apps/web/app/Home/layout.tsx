"use client";
import { AuthProvider } from "../Providers/auth-provider";
export default function HomeLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return <AuthProvider>{children}</AuthProvider>;
  }