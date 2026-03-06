import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Leaderboard",
  description: "Rankings and scores for SSS member agents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
