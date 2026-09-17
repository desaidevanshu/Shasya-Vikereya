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
import { useAuth } from './AuthContext';

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
  const [googleLangOpen, setGoogleLangOpen] = useState(false);
  const [selectedGoogleLang, setSelectedGoogleLang] = useState('en');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const languageRef = useRef<HTMLDivElement>(null);

  // Initialize Google Translate only after React has mounted the hidden target element.
  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setInterval> | null = null;
    let observer: MutationObserver | null = null;

    const styleGoogleWidget = () => {
      const container = document.getElementById('google_translate_element');
      if (!container) return false;

      const combo = container.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (!combo) return false;

      // Keep Google's native control hidden; the custom KrishiClear selector controls it.
      container.style.position = 'absolute';
      container.style.width = '1px';
      container.style.height = '1px';
      container.style.overflow = 'hidden';
      container.style.opacity = '0';
      container.style.pointerEvents = 'none';

      combo.style.position = 'absolute';
      combo.style.width = '1px';
      combo.style.height = '1px';
      combo.style.opacity = '0';
      combo.style.pointerEvents = 'none';

      return true;
    };

    const initializeTranslate = () => {
      if (cancelled) return;

      const container = document.getElementById('google_translate_element');
      const google = (window as any).google;

      if (!container || !google?.translate?.TranslateElement) return;

      if (styleGoogleWidget()) {
        if (retryTimer) {
          clearInterval(retryTimer);
          retryTimer = null;
        }
        observer?.disconnect();
        return;
      }

      try {
        new google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages:
              'en,hi,bn,gu,mr,ta,te,kn,ml,pa,or,as,ur,sa,ne,sd,ks,gom,mai,mni,sat,doi,brx',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
          },
          'google_translate_element'
        );
      } catch (error) {
        console.warn('Google Translate initialization failed:', error);
      }

      styleGoogleWidget();
    };

    const start = () => {
      initializeTranslate();

      retryTimer = setInterval(() => {
        initializeTranslate();

        if (styleGoogleWidget()) {
          if (retryTimer) {
            clearInterval(retryTimer);
            retryTimer = null;
          }
          observer?.disconnect();
        }
      }, 500);
    };

    const container = document.getElementById('google_translate_element');

    if (container) {
      observer = new MutationObserver(() => {
        styleGoogleWidget();
      });

      observer.observe(container, {
        childList: true,
        subtree: true
      });
    }

    const startTimer = setTimeout(start, 100);

    return () => {
      cancelled = true;
      clearTimeout(startTimer);
      if (retryTimer) clearInterval(retryTimer);
      observer?.disconnect();
    };
  }, []);

  // Close custom dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setInnovationsOpen(false);
      }

      if (languageRef.current && !languageRef.current.contains(target)) {
        setGoogleLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { role } = useAuth();

  const allNavItems = [
    { id: 'mandi', label: t.role_mandi, icon: TrendingUp, roles: ['FARMER', 'ADMIN'] },
    { id: 'marketplace', label: t.role_marketplace, icon: ShoppingBag, roles: ['BUYER', 'ADMIN'] },
    { id: 'fpo', label: t.role_fpo, icon: Building2, roles: ['FPO', 'ADMIN'] },
    { id: 'gis', label: t.role_gis, icon: Compass, roles: ['FPO', 'BUYER', 'ADMIN'] },
    { id: 'clearing', label: t.role_clearing, icon: Cpu, roles: ['FPO', 'ADMIN'] },
    { id: 'simulation', label: t.role_simulation, icon: Activity, roles: ['FARMER', 'ADMIN'] },
    { id: 'ledger', label: t.role_ledger, icon: PieChart, roles: ['ADMIN'] }
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role || ''));

  const indianLanguages = [
    { code: 'en', name: 'English', native: 'English' },
    { code: 'hi', name: 'Hindi', native: 'हिंदी' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', native: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'or', name: 'Odia', native: 'ଓଡ଼ିଆ' },
    { code: 'as', name: 'Assamese', native: 'অসমীয়া' },
    { code: 'ur', name: 'Urdu', native: 'اردو' },
    { code: 'sa', name: 'Sanskrit', native: 'संस्कृतम्' },
    { code: 'ne', name: 'Nepali', native: 'नेपाली' },
    { code: 'sd', name: 'Sindhi', native: 'سنڌي' },
    { code: 'gom', name: 'Konkani', native: 'कोंकणी' },
    { code: 'mai', name: 'Maithili', native: 'मैथिली' },
    { code: 'mni', name: 'Manipuri', native: 'মৈতৈলোন' },
    { code: 'sat', name: 'Santali', native: 'ᱥᱟᱱᱛᱟᱲᱤ' },
    { code: 'doi', name: 'Dogri', native: 'डोगरी' },
    { code: 'brx', name: 'Bodo', native: 'बड़ो' },
    { code: 'ks', name: 'Kashmiri', native: 'کٲشُر' }
  ];

  const changeGoogleLanguage = (languageCode: string) => {
    setSelectedGoogleLang(languageCode);
    setGoogleLangOpen(false);

    const applyTranslation = () => {
      const combo = document.querySelector(
        '#google_translate_element .goog-te-combo'
      ) as HTMLSelectElement | null;

      if (!combo) return false;

      const option = Array.from(combo.options).find(
        (item) => item.value === languageCode
      );

      if (!option) return false;

      // Use the native select setter so Google's own change handler receives it.
      const setter = Object.getOwnPropertyDescriptor(
        HTMLSelectElement.prototype,
        'value'
      )?.set;
      setter?.call(combo, languageCode);
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };

    // Google Translate is asynchronous. Try the real widget first.
    if (applyTranslation()) return;

    // Reliable fallback: Google Translate reads this cookie on page load.
    // English means returning to the original page language.
    if (languageCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + window.location.hostname;
    } else {
      const value = `/en/${languageCode}`;
      document.cookie = `googtrans=${value}; path=/`;
      document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
    }

    window.location.reload();
  };

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
          {/* Modern Indian Language Selector */}
          <div
            ref={languageRef}
            style={{
              position: 'relative',
              flexShrink: 0
            }}
          >
            {/* Hidden Google Translate control used by the custom selector */}
            <div
              id="google_translate_element"
              style={{
                position: 'absolute',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
                opacity: 0,
                pointerEvents: 'none'
              }}
            />

            <button
              type="button"
              onClick={() => setGoogleLangOpen(!googleLangOpen)}
              style={{
                height: '34px',
                minWidth: '118px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                padding: '0 10px',
                borderRadius: '9px',
                border: googleLangOpen
                  ? '1px solid rgba(245,158,11,0.45)'
                  : '1px solid var(--border-subtle)',
                background: googleLangOpen
                  ? 'rgba(245,158,11,0.10)'
                  : 'rgba(255,255,255,0.035)',
                color: '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.18s ease',
                boxShadow: googleLangOpen
                  ? '0 0 0 3px rgba(245,158,11,0.06)'
                  : 'none'
              }}
              title="भाषा बदला / Change language"
            >
              <span
                style={{
                  width: '21px',
                  height: '21px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  borderRadius: '5px',
                  background: '#fff',
                  color: '#4285F4',
                  fontFamily: 'Arial, sans-serif',
                  fontSize: '13px',
                  fontWeight: 800,
                  lineHeight: 1
                }}
              >
                G
              </span>

              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 650,
                  letterSpacing: '0.01em'
                }}
              >
                {indianLanguages.find((item) => item.code === selectedGoogleLang)?.native || 'भाषा'}
              </span>

              <ChevronDown
                size={13}
                style={{
                  opacity: 0.65,
                  transform: googleLangOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.18s ease'
                }}
              />
            </button>

            {googleLangOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  width: '340px',
                  maxHeight: '430px',
                  overflowY: 'auto',
                  padding: '8px',
                  borderRadius: '14px',
                  background:
                    'linear-gradient(180deg, rgba(17,24,39,0.99), rgba(8,12,20,0.99))',
                  border: '1px solid rgba(255,255,255,0.12)',
                  boxShadow:
                    '0 24px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,255,255,0.02)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  zIndex: 200
                }}
              >
                <div
                  style={{
                    padding: '8px 10px 10px',
                    marginBottom: '4px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <div
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--brand-gold)',
                      letterSpacing: '0.06em'
                    }}
                  >
                    भारतीय भाषा
                  </div>
                  <div
                    style={{
                      marginTop: '3px',
                      fontSize: '0.67rem',
                      color: 'var(--text-muted)'
                    }}
                  >
                    Choose your preferred language
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3px'
                  }}
                >
                  {indianLanguages.map((language) => (
                    <button
                      key={language.code}
                      type="button"
                      onClick={() => changeGoogleLanguage(language.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '9px',
                        width: '100%',
                        minHeight: '42px',
                        padding: '6px 9px',
                        borderRadius: '8px',
                        border: '1px solid transparent',
                        background: 'transparent',
                        color: '#e5e7eb',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(245,158,11,0.10)';
                        e.currentTarget.style.borderColor = 'rgba(245,158,11,0.18)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          width: '27px',
                          height: '27px',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '7px',
                          background: 'rgba(255,255,255,0.055)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: 'var(--brand-gold)',
                          fontSize: '9px',
                          fontWeight: 700
                        }}
                      >
                        {language.code.toUpperCase().slice(0, 2)}
                      </span>

                      <span
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          minWidth: 0
                        }}
                      >
                        <span
                          style={{
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            color: '#f8fafc',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {language.native}
                        </span>
                        <span
                          style={{
                            fontSize: '0.61rem',
                            color: 'var(--text-muted)',
                            marginTop: '1px',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {language.name}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>


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
