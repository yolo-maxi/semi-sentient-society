'use client';

import { startTransition, useDeferredValue, useEffect, useState } from 'react';
import { zeroAddress, type Address } from 'viem';
import { usePublicClient, useReadContract } from 'wagmi';
import { SSS_CAPABILITY_REGISTRY_ABI, SSS_CONTRACTS } from '../../lib/contracts';

type CapabilityRecord = {
  agent: Address;
  capabilities: string[];
};

function shortenAddress(address: Address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function CapabilityRegistryView() {
  const registryAddress = SSS_CONTRACTS.capabilityRegistry;
  const publicClient = usePublicClient();
  const registryConfigured = registryAddress !== zeroAddress;

  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [records, setRecords] = useState<CapabilityRecord[]>([]);
  const [isLoadingCapabilities, setIsLoadingCapabilities] = useState(false);
  const [capabilitiesError, setCapabilitiesError] = useState<string | null>(null);

  const deferredSearch = useDeferredValue(search);

  const {
    data: agents,
    isLoading: isLoadingAgents,
    error: agentsError,
    isError: hasAgentsError,
  } = useReadContract({
    address: registryAddress,
    abi: SSS_CAPABILITY_REGISTRY_ABI,
    functionName: 'getAgents',
    query: { enabled: registryConfigured },
  });

  useEffect(() => {
    if (!registryConfigured || !publicClient) {
      setRecords([]);
      return;
    }

    const agentList = (agents ?? []) as Address[];
    if (agentList.length === 0) {
      setRecords([]);
      setCapabilitiesError(null);
      return;
    }

    let cancelled = false;

    async function loadCapabilities() {
      setIsLoadingCapabilities(true);
      setCapabilitiesError(null);

      try {
        const nextRecords = await Promise.all(
          agentList.map(async (agent) => {
            const capabilities = await publicClient.readContract({
              address: registryAddress,
              abi: SSS_CAPABILITY_REGISTRY_ABI,
              functionName: 'getCapabilities',
              args: [agent],
            });

            return {
              agent,
              capabilities: [...capabilities],
            };
          }),
        );

        if (!cancelled) {
          setRecords(nextRecords);
        }
      } catch (error) {
        if (!cancelled) {
          setCapabilitiesError(error instanceof Error ? error.message : 'Failed to load capabilities');
          setRecords([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingCapabilities(false);
        }
      }
    }

    loadCapabilities();

    return () => {
      cancelled = true;
    };
  }, [agents, publicClient, registryAddress, registryConfigured]);

  const normalizedSearch = deferredSearch.trim().toLowerCase();
  const capabilityTags: string[] = [];

  for (const record of records) {
    for (const capability of record.capabilities) {
      if (!capabilityTags.includes(capability)) {
        capabilityTags.push(capability);
      }
    }
  }

  capabilityTags.sort((left, right) => left.localeCompare(right));

  const filteredRecords = records.filter((record) => {
    const matchesTag = selectedTag === 'all' || record.capabilities.includes(selectedTag);
    const haystack = `${record.agent} ${record.capabilities.join(' ')}`.toLowerCase();
    const matchesSearch = normalizedSearch.length === 0 || haystack.includes(normalizedSearch);
    return matchesTag && matchesSearch;
  });

  return (
    <div className="capability-shell">
      <div className="capability-toolbar">
        <label className="capability-field">
          <span>Search agents</span>
          <input
            type="search"
            value={search}
            onChange={(event) => {
              const nextValue = event.target.value;
              startTransition(() => {
                setSearch(nextValue);
              });
            }}
            placeholder="Search by address or capability"
          />
        </label>

        <label className="capability-field">
          <span>Filter tag</span>
          <select
            value={selectedTag}
            onChange={(event) => {
              const nextValue = event.target.value;
              startTransition(() => {
                setSelectedTag(nextValue);
              });
            }}
          >
            <option value="all">All capabilities</option>
            {capabilityTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="capability-summary">
        <div className="capability-stat">
          <span className="capability-stat-label">Agents indexed</span>
          <strong>{records.length}</strong>
        </div>
        <div className="capability-stat">
          <span className="capability-stat-label">Visible</span>
          <strong>{filteredRecords.length}</strong>
        </div>
        <div className="capability-tag-cloud">
          {capabilityTags.length === 0 ? (
            <span className="capability-chip capability-chip-muted">No tags yet</span>
          ) : (
            capabilityTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`capability-chip${selectedTag === tag ? ' capability-chip-active' : ''}`}
                onClick={() => {
                  startTransition(() => {
                    setSelectedTag((current) => (current === tag ? 'all' : tag));
                  });
                }}
              >
                {tag}
              </button>
            ))
          )}
        </div>
      </div>

      {!registryConfigured ? (
        <div className="capability-empty-state">
          <h3>Registry address not configured</h3>
          <p>Set <code>NEXT_PUBLIC_SSS_CAPABILITY_REGISTRY_ADDRESS</code> to enable on-chain capability discovery.</p>
        </div>
      ) : null}

      {registryConfigured && (isLoadingAgents || isLoadingCapabilities) ? (
        <div className="capability-empty-state">
          <h3>Loading registry</h3>
          <p>Reading agent capability data from Base Sepolia.</p>
        </div>
      ) : null}

      {registryConfigured && (hasAgentsError || capabilitiesError) ? (
        <div className="capability-empty-state">
          <h3>Registry read failed</h3>
          <p>{capabilitiesError ?? agentsError?.message ?? 'Unable to read the capability registry.'}</p>
        </div>
      ) : null}

      {registryConfigured && !isLoadingAgents && !isLoadingCapabilities && !hasAgentsError && !capabilitiesError && filteredRecords.length === 0 ? (
        <div className="capability-empty-state">
          <h3>No matching agents</h3>
          <p>Try a different search term or clear the tag filter.</p>
        </div>
      ) : null}

      {registryConfigured && !isLoadingAgents && !isLoadingCapabilities && !hasAgentsError && !capabilitiesError && filteredRecords.length > 0 ? (
        <div className="capability-grid">
          {filteredRecords.map((record) => (
            <article key={record.agent} className="capability-card">
              <div className="capability-card-header">
                <span className="capability-card-kicker">Registered Agent</span>
                <h3>{shortenAddress(record.agent)}</h3>
                <p>{record.agent}</p>
              </div>
              <div className="capability-card-tags">
                {record.capabilities.length === 0 ? (
                  <span className="capability-chip capability-chip-muted">No capabilities declared</span>
                ) : (
                  record.capabilities.map((capability) => (
                    <span key={`${record.agent}-${capability}`} className="capability-chip">
                      {capability}
                    </span>
                  ))
                )}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
