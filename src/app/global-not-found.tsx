import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { fontVars } from "@/lib/fonts";

export const metadata: Metadata = { title: "Page not found – BiodataSathi", robots: { index: false } };

export default function GlobalNotFound() {
  return (
    <html lang="en" className={fontVars}>
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="font-display text-4xl">404</h1>
        <p className="text-soft">This page does not exist. · हे पान उपलब्ध नाही. · यह पेज मौजूद नहीं है।</p>
        <div className="flex gap-3 text-sm">
          <Link className="rounded-full bg-maroon px-4 py-2 text-white" href="/">English</Link>
          <Link className="rounded-full bg-maroon px-4 py-2 text-white" href="/hindi/">हिंदी</Link>
          <Link className="rounded-full bg-maroon px-4 py-2 text-white" href="/marathi/">मराठी</Link>
        </div>
      </body>
    </html>
  );
}
