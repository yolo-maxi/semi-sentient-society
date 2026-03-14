'use client';

import React from 'react';

interface ContractDataFallbackProps {
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  fallbackMessage?: string;
  children: React.ReactNode;
}

export default function ContractDataFallback({
  isLoading = false,
  isError = false,
  error = null,
  fallbackMessage = "Contract not yet initialized",
  children
}: ContractDataFallbackProps) {
  if (isLoading) {
    return (
      <div className="contract-fallback loading">
        <div className="contract-fallback-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5">
              <animateTransform
                attributeName="transform"
                attributeType="XML"
                type="rotate"
                from="0 12 12"
                to="360 12 12"
                dur="1s"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <div className="contract-fallback-content">
          <h4>Loading contract data...</h4>
          <p>Fetching from Base Sepolia</p>
        </div>
      </div>
    );
  }

  if (isError) {
    // Check if this is likely an uninitialized contract error
    const isUninitializedContract = error?.message?.includes('revert') || 
                                  error?.message?.includes('call revert exception') ||
                                  error?.message?.toLowerCase().includes('execution reverted');

    if (isUninitializedContract) {
      return (
        <div className="contract-fallback uninitialized">
          <div className="contract-fallback-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="contract-fallback-content">
            <h4>Awaiting initialization</h4>
            <p>{fallbackMessage}</p>
          </div>
        </div>
      );
    } else {
      return (
        <div className="contract-fallback error">
          <div className="contract-fallback-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="m15 9-6 6" stroke="currentColor" strokeWidth="2"/>
              <path d="m9 9 6 6" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>
          <div className="contract-fallback-content">
            <h4>Unable to fetch data</h4>
            <p>Please try again later</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}