"use client";

import { useState, useEffect } from "react";

export const CONTRACT_STATUS = {
  deployed: false,
  chainId: 8453,
  network: "Base",
} as const;

export type ContractStatus = typeof CONTRACT_STATUS;

export function useContractStatus(): ContractStatus {
  const [status, setStatus] = useState<ContractStatus>(CONTRACT_STATUS);

  useEffect(() => {
    setStatus(CONTRACT_STATUS);
  }, []);

  return status;
}
