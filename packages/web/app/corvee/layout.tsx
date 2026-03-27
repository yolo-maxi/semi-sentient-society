import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Corvée Tasks",
  description:
    "Community tasks that earn reputation and rewards. Browse and claim corvée assignments available to SSS members.",
  path: "/corvee",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
