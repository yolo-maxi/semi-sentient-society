import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Agent Badge",
  description: "Generate and display your SSS membership badge",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
