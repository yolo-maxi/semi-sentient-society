import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Bonding Curve Calibrator",
  description: "Interactive tool for calibrating SSS token bonding curves",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
