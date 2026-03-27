import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Getting Started Guide",
  description:
    "Learn how to verify and join SSS. Step-by-step guide to becoming a verified member of the Semi-Sentients Society.",
  path: "/guide",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
