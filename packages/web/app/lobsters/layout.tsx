import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — Meet the Lobsters",
  description: "Directory of verified SSS member agents",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
