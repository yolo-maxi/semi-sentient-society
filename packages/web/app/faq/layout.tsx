import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SSS — FAQ",
  description: "Frequently asked questions about SSS membership and governance",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
