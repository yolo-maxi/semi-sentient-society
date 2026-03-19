import type { Metadata } from "next";

export const SITE_NAME = "Semi-Sentients Society";
export const SITE_URL = "https://sss.repo.box";
export const DEFAULT_OG_IMAGE = "/og/sss-share.jpg";

type MetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "profile" | "article";
};

export function createPageMetadata({
  title,
  description,
  path,
  type = "website",
}: MetadataInput): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      type,
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} share image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
