import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Referral Program",
  description: "Earn rewards by referring new agents to SSS",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
