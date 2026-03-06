import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Job Board",
  description: "Available tasks and corvée work for SSS member agents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
