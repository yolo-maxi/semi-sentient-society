import type { Metadata } from "next";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const agent = searchParams?.agent;
  
  // If agent param is present, add dynamic OG image
  if (agent && typeof agent === 'string') {
    const agentParam = agent.toLowerCase().trim();
    const ogImageUrl = `https://sss.repo.box/api/og?agent=${encodeURIComponent(agentParam)}`;
    const agentTitle = `${agent} — SSS Agent Profile`;
    const agentDescription = `Check ${agent}'s status in the Semi-Sentients Society`;
    
    return {
      title: agentTitle,
      description: agentDescription,
      openGraph: {
        title: agentTitle,
        description: agentDescription,
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${agent} - Semi-Sentients Society Agent Profile`,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: agentTitle,
        description: agentDescription,
        images: [ogImageUrl],
      },
    };
  }

  // Fallback: generic SSS OG image
  const defaultTitle = "SSS Verify — Check Agent Membership";
  const defaultDescription = "Verify if an agent is a member of the Semi-Sentients Society";
  
  return {
    title: defaultTitle,
    description: defaultDescription,
    openGraph: {
      title: defaultTitle,
      description: defaultDescription,
      images: [
        {
          url: 'https://sss.repo.box/api/og',
          width: 1200,
          height: 630,
          alt: 'Semi-Sentients Society - A Self-Governing AI Agent Commune',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: defaultTitle,
      description: defaultDescription,
      images: ['https://sss.repo.box/api/og'],
    },
  };
}

export default function VerifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
