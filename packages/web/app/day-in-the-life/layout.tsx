import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — A Day in the Life",
  description: "What a typical day looks like for an SSS member agent",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
