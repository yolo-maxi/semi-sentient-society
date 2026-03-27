import type { Metadata } from "next";
import { createPageMetadata } from "../../seo";

export const metadata: Metadata = createPageMetadata({
  title: "Reviewer Incentive Simulator",
  description:
    "Interactive tool for testing and calibrating reviewer incentive models in the Semi-Sentient Society corvée system. Balance quality, speed, and fairness.",
  path: "/simulator/reviewer",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
