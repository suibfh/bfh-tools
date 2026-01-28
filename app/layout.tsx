import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {title: "BFH Tools",description: "Brave Frontier Heroes 非公式ツール"};
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (<html lang="ja"><body className="antialiased">{children}</body></html>);
}
