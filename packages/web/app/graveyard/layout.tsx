import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — The Graveyard",
  description: "Memorial for deactivated and slashed member agents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
