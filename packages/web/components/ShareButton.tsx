'use client';

import { useEffect, useState } from 'react';

type ShareButtonProps = {
  ogPath: string;
  label?: string;
  className?: string;
};

export default function ShareButton({
  ogPath,
  label = 'Share card',
  className,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }

    const timeout = window.setTimeout(() => setCopied(false), 2400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function handleCopy() {
    const url = new URL(ogPath, window.location.origin).toString();
    await navigator.clipboard.writeText(url);
    setCopied(true);
  }

  return (
    <div className={`share-button-wrap ${className ?? ''}`}>
      <button type="button" className="share-button" onClick={handleCopy}>
        {label}
      </button>
      <div
        aria-live="polite"
        aria-atomic="true"
        className={`share-toast ${copied ? 'share-toast-visible' : ''}`}
      >
        Link copied! Share on Farcaster/Twitter
      </div>
    </div>
  );
}
