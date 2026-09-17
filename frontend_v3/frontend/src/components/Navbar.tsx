import React, { useState, useRef, useEffect } from 'react';
import { translations, type Language } from '../translations';
import { MandiTicker } from './MandiTicker';
import { 
  Cpu, 
  Activity, 
  PieChart, 
  Building2, 
  TrendingUp, 
  ShoppingBag,
  Globe, 
  Sun, 
  Moon,
  Layers,
  Compass,
  FileText,
  Mic,
  Sparkles,
  ChevronDown,
  Truck,
  Clock,
  ShieldCheck,
  Smartphone
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  onOpenVoice?: () => void;
  onOpenGatePass?: () => void;
  onOpenMilkRun?: () => void;
  onOpenAuctionClock?: () => void;
  onOpenQaManifest?: () => void;
  onOpenWhatsApp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  theme,
  setTheme,
  onOpenVoice,
  onOpenGatePass,
  onOpenMilkRun,
  onOpenAuctionClock,
  onOpenQaManifest,
  onOpenWhatsApp
}) => {
  const t = translations[lang];
  const [innovationsOpen, setInnovationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setInnovationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'mandi', label: t.role_mandi, icon: TrendingUp },
    { id: 'marketplace', label: t.role_marketplace, icon: ShoppingBag },
    { id: 'fpo', label: t.role_fpo, icon: Building2 },
    { id: 'gis', label: t.role_gis, icon: Compass },
    { id: 'clearing', label: t.role_clearing, icon: Cpu },
    { id: 'simulation', label: t.role_simulation, icon: Activity },
    { id: 'ledger', label: t.role_ledger, icon: PieChart }
  ];

  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(8, 12, 20, 0.92)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* 1. Calm Commodity Ticker Tape */}
      <MandiTicker />

      {/* 2. Executive Header Bar */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(217, 119, 6, 0.05) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--brand-gold)'
          }}>
            <Layers size={19} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.18rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                KRISHI<span style={{ color: 'var(--brand-gold)' }}>CLEAR</span>
              </span>
              <span style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)'
              }}>
                v2.5
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Agricultural Clearinghouse & Perishable Telemetry Engine
            </div>
          </div>
        </div>

        {/* Right Action Controls: Innovations, Voice AI, Language, Theme */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          
          {/* Unified Innovations Dropdown Launcher */}
          <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
              onClick={() => setInnovationsOpen(!innovationsOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: innovationsOpen ? 'rgba(245, 158, 11, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: '1px solid',
                borderColor: innovationsOpen ? 'var(--brand-gold)' : 'var(--border-subtle)',
                color: innovationsOpen ? 'var(--brand-gold)' : 'var(--text-primary)',
                transition: 'all 0.15s ease'
              }}
              title="Click to explore the 5 breakthrough supply chain innovations"
            >
              <Sparkles size={14} color="var(--brand-gold)" />
              <span>Innovations</span>
              <span style={{
                background: 'rgba(245, 158, 11, 0.2)',
                color: 'var(--brand-gold)',
                fontSize: '0.65rem',
                fontWeight: 700,
                padding: '1px 5px',
                borderRadius: '10px'
              }}>
                5
              </span>
              <ChevronDown size={13} style={{ transform: innovationsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
            </button>

            {/* Floating Dropdown Menu */}
            {innovationsOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '340px',
                background: 'rgba(15, 23, 42, 0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--border-strong)',
                borderRadius: '12px',
                padding: '8px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                zIndex: 100,
                animation: 'fadeIn 0.15s ease'
              }}>
                <div style={{
                  padding: '8px 12px 6px 12px',
                  borderBottom: '1px solid var(--border-subtle)',
                  marginBottom: '6px'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--brand-gold)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Breakthrough Innovations
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                    Production-ready supply chain interventions
                  </div>
                </div>

                {/* Item 1: Milk-Run Pooling */}
                <button
                  onClick={() => { setInnovationsOpen(false); onOpenMilkRun?.(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '7px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#38bdf8'
                  }}>
                    <Truck size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      Smallholder Milk-Run Pooling
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      UberPool for produce • Save ₹10,366 on freight
                    </div>
                  </div>
                </button>

                {/* Item 2: Auction Clock Radar */}
                <button
                  onClick={() => { setInnovationsOpen(false); onOpenAuctionClock?.(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '7px',
                    background: 'rgba(245, 158, 11, 0.1)',
                    border: '1px solid rgba(245, 158, 11, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#f59e0b'
                  }}>
                    <Clock size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      Auction Clock Distress Rerouter
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      APMC window arbitrage • Salvages +₹15,120
                    </div>
                  </div>
                </button>

                {/* Item 3: QA Escrow */}
                <button
                  onClick={() => { setInnovationsOpen(false); onOpenQaManifest?.(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '7px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <ShieldCheck size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      QA Manifest & Cryptographic Escrow
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      SHA-256 seal & 30-min auto-release payment
                    </div>
                  </div>
                </button>

                {/* Item 4: WhatsApp Dispatch Simulator */}
                <button
                  onClick={() => { setInnovationsOpen(false); onOpenWhatsApp?.(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '7px',
                    background: 'rgba(37, 211, 102, 0.1)',
                    border: '1px solid rgba(37, 211, 102, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#25d366'
                  }}>
                    <Smartphone size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      WhatsApp Zero-Click Simulator
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Playable Marathi audio note & gate pass
                    </div>
                  </div>
                </button>

                {/* Item 5: Sec 5D Gate Pass */}
                <button
                  onClick={() => { setInnovationsOpen(false); onOpenGatePass?.(); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    borderTop: '1px solid var(--border-subtle)',
                    marginTop: '4px',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '7px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#10b981'
                  }}>
                    <FileText size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#f8fafc' }}>
                      APMC Section 5D Gate Pass
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      Statutory Direct Marketing Exemption Pass
                    </div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Dedicated Voice Assistant Button */}
          {onOpenVoice && (
            <button
              onClick={onOpenVoice}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: '#34d399',
                transition: 'all 0.15s ease'
              }}
              title="Real-time Voice Assistant with Microphone Input & Speech Audio"
            >
              <Mic size={14} color="#34d399" />
              <span>Voice AI</span>
            </button>
          )}

          {/* Compact Language Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '8px',
            border: '1px solid var(--border-subtle)',
            padding: '2px'
          }}>
            {(['en', 'hi', 'mr'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                  color: lang === l ? '#ffffff' : 'var(--text-muted)',
                  border: 'none',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {l === 'en' ? 'EN' : l === 'hi' ? 'HI' : 'MR'}
              </button>
            ))}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{
              padding: '6px 8px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* 3. Spacious Segmented Navigation Tab Bar */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'rgba(5, 8, 15, 0.6)'
      }}>
        <nav style={{
          maxWidth: '1440px',
          margin: '0 auto',
          padding: '4px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          overflowX: 'auto'
        }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 600 : 500,
                  border: 'none',
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                <Icon size={15} color={isActive ? 'var(--brand-gold)' : 'currentColor'} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
