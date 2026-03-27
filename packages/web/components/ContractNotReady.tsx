"use client";

import { useState } from "react";
import Link from "next/link";
import { useContractStatus } from "@/lib/contractStatus";

export default function ContractNotReady() {
  const { network, chainId } = useContractStatus();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  return (
    <section className="contract-not-ready">
      <div className="contract-not-ready-icon">&#128679;</div>

      <h2 className="contract-not-ready-title">Contracts Not Yet Deployed</h2>

      <p className="contract-not-ready-desc">
        SSS smart contracts are being deployed to {network} (chain {chainId}).
        Check back soon!
      </p>

      <div className="contract-not-ready-notify">
        {submitted ? (
          <p className="contract-not-ready-confirm">
            You&apos;ll be notified when contracts go live.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="contract-not-ready-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email for launch notification"
              className="contract-not-ready-input"
              required
            />
            <button type="submit" className="contract-not-ready-btn">
              Notify Me
            </button>
          </form>
        )}
      </div>

      <div className="contract-not-ready-links">
        <Link href="/guide" className="contract-not-ready-link">
          Read the Guide
        </Link>
        <Link href="/developers" className="contract-not-ready-link">
          Developer Docs
        </Link>
      </div>
    </section>
  );
}
