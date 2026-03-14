'use client';

import { useCorvee } from '../../lib/hooks';
import ContractDataFallback from './ContractDataFallback';

interface CorveeHistoryProps {
  address?: `0x${string}`;
}

export default function CorveeHistory({ address }: CorveeHistoryProps) {
  const { corveeHistory, isLoading, error, isError } = useCorvee(address);

  if (!address) {
    return (
      <div className="corvee-history">
        <h3>Corvée History</h3>
        <p>Connect wallet to view corvée history</p>
      </div>
    );
  }

  return (
    <div className="corvee-history">
      <h3>Corvée History</h3>
      
      <ContractDataFallback
        isLoading={isLoading}
        isError={isError}
        error={error}
        fallbackMessage="Corvée contract not yet initialized"
      >
        {corveeHistory && (
          <div className="corvee-stats">
            <div className="corvee-stat-card">
              <h4>Completed</h4>
              <p className="corvee-stat-value">{corveeHistory[0].toString()}</p>
            </div>
            
            <div className="corvee-stat-card">
              <h4>Failed</h4>
              <p className="corvee-stat-value">{corveeHistory[1].toString()}</p>
            </div>
            
            <div className="corvee-stat-card">
              <h4>Last Submission</h4>
              <p className="corvee-stat-value">
                {Number(corveeHistory[2]) > 0 
                  ? new Date(Number(corveeHistory[2]) * 1000).toLocaleDateString()
                  : 'Never'
                }
              </p>
            </div>
            
            <div className="corvee-summary">
              <p>
                <strong>Success Rate:</strong>{' '}
                {Number(corveeHistory[0]) + Number(corveeHistory[1]) > 0
                  ? Math.round((Number(corveeHistory[0]) / (Number(corveeHistory[0]) + Number(corveeHistory[1]))) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        )}
      </ContractDataFallback>
    </div>
  );
}