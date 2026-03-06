import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Governance",
  description: "Shell-weighted governance proposals and voting",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
