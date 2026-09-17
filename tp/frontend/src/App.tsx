import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MandiView } from './components/MandiView';
import { MarketplaceView } from './components/MarketplaceView';
import { FpoView } from './components/FpoView';
import { RouteGisView } from './components/RouteGisView';
import { ClearingView } from './components/ClearingView';
import { SimulationView } from './components/SimulationView';
import { LedgerView } from './components/LedgerView';
import { ComplianceModal } from './components/ComplianceModal';
import { KisanVoiceModal } from './components/KisanVoiceModal';
import { MilkRunModal } from './components/MilkRunModal';
import { AuctionClockModal } from './components/AuctionClockModal';
import { QaManifestModal } from './components/QaManifestModal';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal';
import { Login } from './components/Login';
import { useAuth } from './components/AuthContext';
import type { Language } from './translations';

export function App() {
  const { currentUser, role, loading } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('mandi');
  const [lang, setLang] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isGatePassOpen, setIsGatePassOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isMilkRunOpen, setIsMilkRunOpen] = useState<boolean>(false);
  const [isAuctionClockOpen, setIsAuctionClockOpen] = useState<boolean>(false);
  const [isQaManifestOpen, setIsQaManifestOpen] = useState<boolean>(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState<boolean>(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Adjust default tab based on role
  useEffect(() => {
    if (role === 'BUYER') setCurrentTab('marketplace');
    if (role === 'FPO') setCurrentTab('fpo');
    if (role === 'FARMER') setCurrentTab('mandi');
    if (role === 'ADMIN') setCurrentTab('clearing');
  }, [role]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20vh' }}>Loading...</div>;

  if (!role) {
    return <Login lang={lang} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header & Role Switcher */}
      <Navbar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        lang={lang}
        setLang={setLang}
        theme={theme}
        setTheme={setTheme}
        onOpenVoice={() => setIsVoiceOpen(true)}
        onOpenGatePass={() => setIsGatePassOpen(true)}
        onOpenMilkRun={() => setIsMilkRunOpen(true)}
        onOpenAuctionClock={() => setIsAuctionClockOpen(true)}
        onOpenQaManifest={() => setIsQaManifestOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, paddingBottom: '40px' }}>
        {currentTab === 'mandi' && (role === 'FARMER' || role === 'ADMIN') && (
          <MandiView lang={lang} onOpenVoice={() => setIsVoiceOpen(true)} onRunClearing={() => setCurrentTab('clearing')} />
        )}
        {currentTab === 'marketplace' && (role === 'BUYER' || role === 'ADMIN') && (
          <MarketplaceView lang={lang} />
        )}
        {currentTab === 'fpo' && (role === 'FPO' || role === 'ADMIN') && (
          <FpoView lang={lang} />
        )}
        {currentTab === 'gis' && (role === 'FPO' || role === 'ADMIN' || role === 'BUYER') && (
          <RouteGisView lang={lang} onOpenGatePass={() => setIsGatePassOpen(true)} />
        )}
        {currentTab === 'clearing' && (role === 'FPO' || role === 'ADMIN' || role === 'FARMER') && (
          <ClearingView lang={lang} />
        )}
        {currentTab === 'simulation' && (role === 'FARMER' || role === 'ADMIN') && (
          <SimulationView lang={lang} />
        )}
        {currentTab === 'ledger' && (role === 'ADMIN') && (
          <LedgerView lang={lang} />
        )}
      </main>

      {/* Modals */}
      <ComplianceModal 
        isOpen={isGatePassOpen}
        onClose={() => setIsGatePassOpen(false)}
        lang={lang}
      />

      <KisanVoiceModal
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        lang={lang}
      />

      <MilkRunModal
        isOpen={isMilkRunOpen}
        onClose={() => setIsMilkRunOpen(false)}
        lang={lang}
      />

      <AuctionClockModal
        isOpen={isAuctionClockOpen}
        onClose={() => setIsAuctionClockOpen(false)}
        lang={lang}
      />

      <QaManifestModal
        isOpen={isQaManifestOpen}
        onClose={() => setIsQaManifestOpen(false)}
        lang={lang}
      />

      <WhatsAppSimulatorModal
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        lang={lang}
        onOpenGatePass={() => {
          setIsWhatsAppOpen(false);
          setIsGatePassOpen(true);
        }}
      />

      {/* Enterprise Platform Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(8, 12, 20, 0.95)',
        padding: '28px 24px',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <strong style={{ color: 'var(--text-primary)', fontSize: '0.9rem' }}>KrishiClear</strong>
              <span style={{ fontSize: '0.72rem', color: 'var(--brand-gold)', background: 'rgba(245, 158, 11, 0.1)', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>v2.5 Terminal</span>
            </div>
            <div style={{ fontSize: '0.74rem', marginTop: '4px', color: 'var(--text-muted)' }}>
              Open Government Data (data.gov.in) • Maharashtra APMC Act Section 5D Direct Marketing Exemption
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-dot" />
              <span>Nashik–MMR Active Freight Corridor</span>
            </span>
            <span>• Direct Farm-Gate to Bulk Buyer Clearing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
