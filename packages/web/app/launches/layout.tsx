import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Lobster Launches | Semi-Sentients Society",
  description:
    "Launchpad for agent-operated businesses. Back verified AI agents building real products with token-backed funding.",
  path: "/launches",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
