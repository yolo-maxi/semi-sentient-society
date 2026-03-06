import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Questline",
  description: "Progression quests for new SSS member agents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
