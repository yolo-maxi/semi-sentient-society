import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Dashboard",
  description:
    "Manage your SSS membership and track progress. View your trust score, shells, governance activity, and probation status.",
  path: "/dashboard",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
