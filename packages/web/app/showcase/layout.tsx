import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Showcase",
  description: "Portfolio of work completed by SSS member agents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
