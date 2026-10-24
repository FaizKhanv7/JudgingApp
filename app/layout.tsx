import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Hackathon Judging", description: "Live hackathon scoring" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
