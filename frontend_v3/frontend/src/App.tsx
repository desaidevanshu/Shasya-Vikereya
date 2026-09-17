import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Footer } from './components/Footer.tsx';
import { type Language } from './translations.ts';

// Landing Page & Types
import { LandingView, UserRole } from './features/landing/LandingView.tsx';

// 6 Dedicated Persona Profile Views
import { FarmerProfileView } from './features/profiles/FarmerProfileView.tsx';
import { FpoProfileView } from './features/profiles/FpoProfileView.tsx';
import { BuyerProfileView } from './features/profiles/BuyerProfileView.tsx';
import { TransporterProfileView } from './features/profiles/TransporterProfileView.tsx';
import { ConsumerProfileView } from './features/profiles/ConsumerProfileView.tsx';
import { PlatformProfileView } from './features/profiles/PlatformProfileView.tsx';

// Modals & Alerts
import { GatePassModal } from './features/compliance/GatePassModal.tsx';
import { KisanVoiceWidget } from './features/voice-assistant/KisanVoiceWidget.tsx';
import { GlutAlertBanner } from './features/arbitrage/GlutAlertBanner.tsx';
import { MilkRunModal } from './components/MilkRunModal.tsx';
import { AuctionClockModal } from './components/AuctionClockModal.tsx';
import { QaManifestModal } from './components/QaManifestModal.tsx';
import { WhatsAppSimulatorModal } from './components/WhatsAppSimulatorModal.tsx';
import { MandiTicker } from './components/MandiTicker.tsx';
import { AuthScreen } from './components/AuthScreen.tsx';
import { useAuth } from './components/AuthContext.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { MarketplaceWorkspace } from './features/marketplace/MarketplaceWorkspace.tsx';

export default function App() {
  const { currentUser, role, setRole, loading } = useAuth();
  const [currentRole, setCurrentRole] = useState<UserRole | 'landing'>((role as UserRole) || 'landing');
  const [lang, setLang] = useState<Language>('en');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isGatePassOpen, setIsGatePassOpen] = useState(false);
  const [isMilkRunOpen, setIsMilkRunOpen] = useState(false);
  const [isAuctionClockOpen, setIsAuctionClockOpen] = useState(false);
  const [isQaManifestOpen, setIsQaManifestOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    setCurrentRole((role as UserRole) || 'landing');
  }, [role]);

  useEffect(() => {
    if (!currentUser) setShowAuth(false);
  }, [currentUser]);

  const selectRole = (nextRole: UserRole | 'landing') => {
    if (nextRole === 'landing') return;
    setCurrentRole(nextRole);
    setShowMarketplace(false);
    void setRole(nextRole);
  };

  if (loading) {
    return <div className="min-h-screen bg-surface flex items-center justify-center text-on-surface-variant">Checking secure access...</div>;
  }

  if (!currentUser && !showAuth) return <LandingPage onStart={() => setShowAuth(true)} />;
  if (!currentUser || !role) return <AuthScreen />;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col selection:bg-secondary-fixed selection:text-on-secondary-fixed transition-colors duration-200">
      {/* Floating Pill Navigation Header with Persona status & quick role switcher */}
      <Header
        currentRole={currentRole}
        onSelectRole={selectRole}
        isDark={isDark}
        setIsDark={setIsDark}
        lang={lang}
        setLang={setLang}
        onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
        onOpenGatePass={() => setIsGatePassOpen(true)}
        onOpenMilkRun={() => setIsMilkRunOpen(true)}
        onOpenAuctionClock={() => setIsAuctionClockOpen(true)}
        onOpenQaManifest={() => setIsQaManifestOpen(true)}
        onOpenWhatsApp={() => setIsWhatsAppOpen(true)}
        onOpenMarketplace={() => setShowMarketplace(true)}
      />

      <div className="pt-[82px]">
        <MandiTicker />
      </div>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-10">
        {/* Distress & Glut-Shock Reroute Alert (shown when logged in) */}
        {currentRole !== 'landing' && <GlutAlertBanner />}

        {showMarketplace && currentRole !== 'landing' && (
          <MarketplaceWorkspace role={currentRole} onBack={() => setShowMarketplace(false)} onOpenGatePass={() => setIsGatePassOpen(true)} />
        )}

        {/* Route 0: Landing Page with 6 Demo Login Cards */}
        {!showMarketplace && currentRole === 'landing' && (
          <LandingView onSelectRole={selectRole} />
        )}

        {/* Route 1: Farmer / Producer Profile (Ramesh Patil) */}
        {!showMarketplace && currentRole === 'farmer' && (
          <FarmerProfileView
            onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
            onOpenGatePass={() => setIsGatePassOpen(true)}
          />
        )}

        {/* Route 2: FPO / Collective Profile (Sahyadri Farmers Agro FPO) */}
        {!showMarketplace && currentRole === 'fpo' && (
          <FpoProfileView
            onOpenGatePass={() => setIsGatePassOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
          />
        )}

        {/* Route 3: Bulk Buyer / HoReCa Profile (GreenLeaf Kitchens & Hospitality) */}
        {!showMarketplace && currentRole === 'buyer' && (
          <BuyerProfileView onOpenGatePass={() => setIsGatePassOpen(true)} />
        )}

        {/* Route 4: Transporter / Fleet Profile (KisanLogistics Fleet) */}
        {!showMarketplace && currentRole === 'transporter' && (
          <TransporterProfileView lang={lang} onOpenGatePass={() => setIsGatePassOpen(true)} />
        )}

        {/* Route 5: Direct Retail Consumer Profile (Ananya Deshmukh) */}
        {!showMarketplace && currentRole === 'consumer' && (
          <ConsumerProfileView onOpenGatePass={() => setIsGatePassOpen(true)} />
        )}

        {/* Route 6: Platform Operations Profile (Platform Operations Admin) */}
        {!showMarketplace && currentRole === 'platform' && (
          <PlatformProfileView
            onOpenGatePass={() => setIsGatePassOpen(true)}
            onOpenVoiceAssistant={() => setIsVoiceOpen(true)}
          />
        )}
      </main>

      {/* Persistent Telemetry Footer */}
      <Footer />

      {/* Digital Gate Pass Modal */}
      <GatePassModal
        isOpen={isGatePassOpen}
        onClose={() => setIsGatePassOpen(false)}
      />

      <MilkRunModal isOpen={isMilkRunOpen} onClose={() => setIsMilkRunOpen(false)} lang={lang} />
      <AuctionClockModal isOpen={isAuctionClockOpen} onClose={() => setIsAuctionClockOpen(false)} lang={lang} />
      <QaManifestModal isOpen={isQaManifestOpen} onClose={() => setIsQaManifestOpen(false)} lang={lang} />
      <WhatsAppSimulatorModal isOpen={isWhatsAppOpen} onClose={() => setIsWhatsAppOpen(false)} lang={lang} onOpenGatePass={() => setIsGatePassOpen(true)} />

      {/* Multilingual Voice Assistant Modal */}
      <KisanVoiceWidget
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        lang={lang}
      />
    </div>
  );
}
