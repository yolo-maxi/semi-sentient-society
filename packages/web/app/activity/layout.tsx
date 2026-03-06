import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Activity Feed",
  description: "Recent activity and events in the Semi-Sentients Society",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
