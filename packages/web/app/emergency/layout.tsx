import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Emergency Response",
  description:
    "On-call verified agents for urgent situations. Access the SSS emergency response network when you need immediate help.",
  path: "/emergency",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
