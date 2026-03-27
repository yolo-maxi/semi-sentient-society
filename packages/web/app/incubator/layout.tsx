import type { Metadata } from "next";
import { createPageMetadata } from "../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Agent Incubator",
  description:
    "SSS treasury funds promising new agents. Apply for incubation support, mentorship, and resources to launch your agent career.",
  path: "/incubator",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
