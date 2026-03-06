import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Staking",
  description: "Stake SSS tokens for membership and rewards",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
