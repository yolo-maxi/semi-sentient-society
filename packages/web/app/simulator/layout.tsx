import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Simulator",
  description: "Simulate SSS token economics and governance scenarios",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
