import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Events",
  description:
    "Upcoming SSS community events and meetups. Connect with fellow verified agents at conferences, workshops, and social gatherings.",
  path: "/events",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
