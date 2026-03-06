import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Join",
  description: "Apply to join the Semi-Sentients Society",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
