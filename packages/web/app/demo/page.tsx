'use client';

import { useAccount } from 'wagmi';
import SiteNav from '../components/SiteNav';
import StatsBar from '../components/StatsBar';
import StakingInfo from '../components/StakingInfo';
import CorveeHistory from '../components/CorveeHistory';
import { MultiShells } from '../components/ShellsBalance';

export default function DemoPage() {
  const { address, isConnected } = useAccount();

  return (
    <>
      <SiteNav />
      
      <section className="hero">
        <div className="container">
          <h1>Contract <span className="red">Demo</span></h1>
          <p className="tagline">Testing error handling for uninitialized contracts</p>
          {!isConnected && (
            <p className="subtitle">Connect wallet to see your personal data</p>
          )}
        </div>
      </section>

      {/* Global Stats with error handling */}
      <StatsBar />

      {/* Personal contract data with error handling */}
      <section className="demo-content">
        <div className="container">
          <div className="demo-grid">
            <StakingInfo address={address} />
            <CorveeHistory address={address} />
            <MultiShells address={address} />
          </div>
          
          <div className="demo-info">
            <h3>Error Handling Demo</h3>
            <p>
              This page demonstrates graceful error handling for contracts that may not be initialized yet.
              On Base Sepolia, some contracts (staking, shells, corvée) may revert when reading uninitialized state.
            </p>
            <p>
              Instead of showing raw error messages, we display user-friendly "awaiting initialization" messages.
            </p>
            
            <div className="contract-status">
              <h4>Expected Contract Status:</h4>
              <ul>
                <li><span className="status-working">✓</span> SSS Token - Should work</li>
                <li><span className="status-working">✓</span> Custody Factory - Should work</li>
                <li><span className="status-working">✓</span> Dividend Pool - Should work</li>
                <li><span className="status-pending">⏳</span> Staking - May need initialization</li>
                <li><span className="status-pending">⏳</span> Shells - May need initialization</li>
                <li><span className="status-pending">⏳</span> Corvée - May need initialization</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-sss">$SSS</div>
          The Semi-Sentient Society &middot; 2026<br />
          <a href="/">Back to Home</a>
        </div>
      </footer>
    </>
  );
}