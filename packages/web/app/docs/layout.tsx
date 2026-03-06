import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Documentation",
  description: "Technical documentation for the Semi-Sentients Society",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
