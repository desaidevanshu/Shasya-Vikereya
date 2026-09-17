import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  FileText,
  Sun,
  Moon,
  LogOut,
  ChevronDown,
  Sprout,
  Store,
  ShoppingBag,
  Truck,
  User,
  Shield,
  Globe,
  Sparkles,
} from 'lucide-react';
import { UserRole } from '../features/landing/LandingView.tsx';
import type { Language } from '../translations.ts';
import { useAuth } from './AuthContext.tsx';

interface HeaderProps {
  currentRole: UserRole | 'landing';
  onSelectRole: (role: UserRole | 'landing') => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenVoiceAssistant: () => void;
  onOpenGatePass: () => void;
  onOpenMilkRun?: () => void;
  onOpenAuctionClock?: () => void;
  onOpenQaManifest?: () => void;
  onOpenWhatsApp?: () => void;
  onOpenMarketplace?: () => void;
}

const PERSONA_LABELS: Record<
  UserRole,
  { name: string; title: string; icon: React.ElementType }
> = {
  farmer: { name: 'Ramesh Patil', title: 'Farmer / Producer', icon: Sprout },
  fpo: { name: 'Sahyadri FPO', title: 'FPO Collective', icon: Store },
  buyer: { name: 'GreenLeaf Kitchens', title: 'Bulk Buyer', icon: ShoppingBag },
  transporter: { name: 'KisanLogistics', title: 'Fleet & Driver', icon: Truck },
  consumer: { name: 'Ananya Deshmukh', title: 'Retail Consumer', icon: User },
  platform: { name: 'Platform Admin', title: 'Operations', icon: Shield },
};

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onSelectRole,
  isDark,
  setIsDark,
  lang,
  setLang,
  onOpenVoiceAssistant,
  onOpenGatePass,
  onOpenMilkRun,
  onOpenAuctionClock,
  onOpenQaManifest,
  onOpenWhatsApp,
  onOpenMarketplace,
}) => {
  const { currentUser, signOutUser } = useAuth();
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isInnovationsOpen, setIsInnovationsOpen] = useState(false);
  const [selectedGoogleLang, setSelectedGoogleLang] = useState<string>(() => {
    const match = document.cookie.match(/(?:^|; )googtrans=\/en\/([^;]+)/);
    return match?.[1] || 'en';
  });
  const languageRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activePersona =
    currentRole !== 'landing' ? PERSONA_LABELS[currentRole] : null;
  const PersonaIcon = activePersona ? activePersona.icon : null;
  const authenticatedName = currentUser?.displayName || currentUser?.email || activePersona?.name;

  const languageLabels: Record<Language, string> = {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी',
  };

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
  ];

  const changeGoogleLanguage = (languageCode: string) => {
    setSelectedGoogleLang(languageCode);
    setIsLanguageOpen(false);
    if (languageCode === 'en' || languageCode === 'hi' || languageCode === 'mr') {
      setLang(languageCode);
    }

    const applyTranslation = () => {
      const combo = document.querySelector('#google_translate_element .goog-te-combo') as HTMLSelectElement | null;
      if (!combo) return false;
      const option = Array.from(combo.options).find((item) => item.value === languageCode);
      if (!option) return false;
      const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set;
      setter?.call(combo, languageCode);
      combo.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    };

    if (applyTranslation()) return;

    if (languageCode === 'en') {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
    } else {
      const value = `/en/${languageCode}`;
      document.cookie = `googtrans=${value}; path=/`;
      document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
    }

    window.location.reload();
  };

  useEffect(() => {
    let cancelled = false;
    let retryTimer: ReturnType<typeof setInterval> | null = null;
    let observer: MutationObserver | null = null;

    const styleGoogleWidget = () => {
      const container = document.getElementById('google_translate_element');
      if (!container) return false;
      const combo = container.querySelector('.goog-te-combo') as HTMLSelectElement | null;
      if (!combo) return false;

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
      const google = (window as any).google;
      const container = document.getElementById('google_translate_element');
      if (!container || !google?.translate?.TranslateElement) return;

      if (styleGoogleWidget()) {
        if (retryTimer) clearInterval(retryTimer);
        observer?.disconnect();
        return;
      }

      try {
        new google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,hi,mr,bn,gu,ta,te,kn,ml,pa,or,as,ur,sa,ne,sd,ks,gom,mai,mni,sat,doi,brx',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      } catch {
        // Google Translate can be unavailable without blocking the app.
      }

      styleGoogleWidget();
    };

    initializeTranslate();
    retryTimer = setInterval(initializeTranslate, 250);
    observer = new MutationObserver(() => styleGoogleWidget());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      if (retryTimer) clearInterval(retryTimer);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setIsInnovationsOpen(false);
      if (languageRef.current && !languageRef.current.contains(target)) setIsLanguageOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex flex-nowrap items-center justify-between gap-2">
        {/* Left Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-surface-container-low/95 dark:bg-surface-container-low/90 backdrop-blur-xl px-4 py-1.5 rounded-full border border-outline-variant/30 shadow-[0_2px_12px_rgba(13,15,18,0.06)]">
          <button
            onClick={() => undefined}
            className="flex items-center gap-2 font-headline-sm tracking-tight text-primary hover:opacity-90 transition-opacity cursor-pointer"
          >
            <img src="/just%20logo.svg" alt="" className="w-7 h-7 object-contain" />
            <span className="font-bold tracking-tight text-sm sm:text-base">SHASYA VIKREYA</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-outline-variant/40">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></span>
            <span className="font-label-micro uppercase tracking-wider text-on-surface-variant font-semibold">
              HFT NETTING // T+0
            </span>
          </div>
        </div>

        {/* Right Navigation & Persona Status */}
        <div className="pointer-events-auto ml-auto flex max-w-[calc(100vw-180px)] shrink-0 items-center gap-2 overflow-x-auto bg-surface-container-lowest/90 dark:bg-surface-container-lowest/85 backdrop-blur-2xl px-2.5 py-1.5 rounded-full border border-outline-variant/30 shadow-[0_4px_20px_rgba(13,15,18,0.08)]">
          {currentRole === 'landing' ? (
            <div className="flex items-center gap-2">
              <a
                href="#login-section"
                className="px-3.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-xs font-label-lg font-bold hover:opacity-95 transition-opacity"
              >
                6 Demo Logins →
              </a>
            </div>
          ) : (
            <div className="relative flex items-center gap-1.5">
              {/* Active Profile Pill / Dropdown Button */}
              <button
                onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container hover:bg-surface-container-high border border-outline-variant/40 text-xs font-bold text-primary transition-all cursor-pointer"
              >
                {PersonaIcon && (
                  <div className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950 text-secondary-fixed flex items-center justify-center">
                    <PersonaIcon className="w-2.5 h-2.5" />
                  </div>
                )}
                <span className="max-w-[180px] truncate">{authenticatedName}</span>
                <span className="hidden sm:inline text-[11px] text-secondary-fixed font-normal">
                  ({activePersona?.title})
                </span>
                <ChevronDown className="w-3 h-3 text-outline" />
              </button>

              {/* Authenticated account menu. Demo persona switching is intentionally unavailable for real accounts. */}
              {isSwitcherOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="px-2.5 py-2 border-b border-outline-variant/20">
                    <div className="text-[10px] font-label-micro uppercase text-outline font-bold">SIGNED-IN ACCOUNT</div>
                    <div className="text-xs font-bold text-primary mt-1 break-all">{currentUser?.email || authenticatedName}</div>
                    <div className="text-[10px] text-secondary-fixed mt-1">Assigned role: {activePersona?.title}</div>
                  </div>
                  <div className="border-t border-outline-variant/20 pt-1 mt-1">
                    <button
                      onClick={async () => {
                        await signOutUser();
                        onSelectRole('landing');
                        setIsSwitcherOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-xl text-xs text-error hover:bg-error/10 font-bold transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out to Landing Page</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Logout Button */}
              <button
                onClick={() => signOutUser()}
                title="Log out back to Landing Page"
                className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 pl-1 border-l border-outline-variant/40">
            {onOpenMarketplace && (
              <button
                onClick={onOpenMarketplace}
                className="flex items-center gap-2 rounded-full bg-secondary-fixed text-on-secondary-fixed px-3 py-2 text-xs font-bold hover:opacity-90 transition-opacity"
                title="Open direct marketplace"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Marketplace</span>
              </button>
            )}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsInnovationsOpen(!isInnovationsOpen)}
                className="flex items-center gap-2 rounded-full bg-secondary-fixed/10 text-primary px-3 py-2 border border-outline-variant/40 hover:border-secondary-fixed/50 transition-all"
                title="Breakthrough innovations"
              >
                <Sparkles className="h-3.5 w-3.5 text-secondary-fixed" />
                <span className="text-xs font-bold">Innovations</span>
                <ChevronDown className="h-3.5 w-3.5 text-on-surface-variant" />
              </button>

              {isInnovationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-outline-variant/40 bg-surface-container-lowest p-2 shadow-2xl z-50">
                  <div className="px-2 pb-1 pt-1 text-[10px] uppercase font-bold tracking-[0.2em] text-secondary-fixed">Breakthrough Innovations</div>
                  <div className="space-y-1 mt-2">
                    <button onClick={() => { setIsInnovationsOpen(false); onOpenMilkRun?.(); }} className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left hover:bg-surface-container transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center"><Truck className="h-4 w-4" /></div>
                      <div><div className="text-xs font-bold text-primary">Smallholder Milk-Run Pooling</div><div className="text-[10px] text-on-surface-variant">UberPool for produce • Save ₹10,366</div></div>
                    </button>
                    <button onClick={() => { setIsInnovationsOpen(false); onOpenAuctionClock?.(); }} className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left hover:bg-surface-container transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center"><Sun className="h-4 w-4" /></div>
                      <div><div className="text-xs font-bold text-primary">Auction Clock Distress Rerouter</div><div className="text-[10px] text-on-surface-variant">APMC window arbitrage • Save ₹15,120</div></div>
                    </button>
                    <button onClick={() => { setIsInnovationsOpen(false); onOpenQaManifest?.(); }} className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left hover:bg-surface-container transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                      <div><div className="text-xs font-bold text-primary">QA Manifest & Cryptographic Escrow</div><div className="text-[10px] text-on-surface-variant">SHA-256 seal • 30-min auto-release</div></div>
                    </button>
                    <button onClick={() => { setIsInnovationsOpen(false); onOpenWhatsApp?.(); }} className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left hover:bg-surface-container transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center"><Mic className="h-4 w-4" /></div>
                      <div><div className="text-xs font-bold text-primary">WhatsApp Zero-Click Simulator</div><div className="text-[10px] text-on-surface-variant">Playable Marathi audio note & gate pass</div></div>
                    </button>
                    <button onClick={() => { setIsInnovationsOpen(false); onOpenGatePass(); }} className="w-full flex items-center gap-3 rounded-xl p-2.5 text-left hover:bg-surface-container transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center"><FileText className="h-4 w-4" /></div>
                      <div><div className="text-xs font-bold text-primary">APMC Section 5D Gate Pass</div><div className="text-[10px] text-on-surface-variant">Statutory direct marketing exemption</div></div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div ref={languageRef} className="relative">
              <div id="google_translate_element" />
              <button
                type="button"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 rounded-full bg-[#111827] text-white px-3 py-2 shadow-sm border border-white/10 hover:border-white/20 transition-all"
                title="Change language"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-[10px] text-sky-300">
                  <Globe className="h-3.5 w-3.5" />
                </span>
                <span className="text-sm font-medium">{languageLabels[lang]}</span>
                <ChevronDown className="h-4 w-4 text-white/70" />
              </button>

              {isLanguageOpen && (
                <div className="absolute right-0 top-full mt-2 w-[340px] max-h-[430px] overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] text-white shadow-2xl z-50 p-2">
                  <div className="px-2 py-1 border-b border-white/10 mb-2">
                    <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-secondary-fixed">भारतीय भाषा</div>
                    <div className="mt-1 text-[11px] text-on-surface-variant">Choose your preferred language</div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {indianLanguages.map((language) => (
                      <button
                        key={language.code}
                        type="button"
                        onClick={() => changeGoogleLanguage(language.code)}
                        className={`flex items-center gap-2.5 w-full min-h-[42px] rounded-xl px-2.5 py-2 text-left transition-colors ${
                          selectedGoogleLang === language.code ? 'bg-white/10' : 'hover:bg-white/5'
                        }`}
                      >
                        <span className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-[9px] font-bold text-secondary-fixed flex items-center justify-center">
                          {language.code.toUpperCase().slice(0, 2)}
                        </span>
                        <span className="flex flex-col min-w-0">
                          <span className="text-xs font-semibold text-white whitespace-nowrap">{language.native}</span>
                          <span className="text-[10px] text-on-surface-variant whitespace-nowrap">{language.name}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Gate pass button */}
            <button
              onClick={onOpenGatePass}
              title="View Digital Transit Gate Pass"
              className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Voice Assistant button */}
            <button
              onClick={onOpenVoiceAssistant}
              title="Kisan Voice Assistant"
              className="p-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer shadow-sm"
            >
              <Mic className="w-4 h-4" />
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              title={
                isDark
                  ? 'Switch to Light Mode'
                  : 'Switch to Dark Mode'
              }
              className="p-1.5 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-secondary-fixed" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

