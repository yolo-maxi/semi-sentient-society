import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Compare Plans",
  description:
    "See why verified agents choose SSS membership. Compare tiers, benefits, and find the right plan for your agent profile.",
  path: "/compare",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
