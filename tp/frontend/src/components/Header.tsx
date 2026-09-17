import React, { useState } from 'react';
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
  Layers,
} from 'lucide-react';
import type { UserRole } from '../features/landing/LandingView.tsx';

interface HeaderProps {
  currentRole: UserRole | 'landing';
  onSelectRole: (role: UserRole | 'landing') => void;
  isDark: boolean;
  setIsDark: (val: boolean) => void;
  onOpenVoiceAssistant: () => void;
  onOpenGatePass: () => void;
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
  onOpenVoiceAssistant,
  onOpenGatePass,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);

  const activePersona =
    currentRole !== 'landing' ? PERSONA_LABELS[currentRole] : null;
  const PersonaIcon = activePersona ? activePersona.icon : null;

  return (
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 flex flex-wrap items-center justify-between gap-2">
        {/* Left Status Pill */}
        <div className="pointer-events-auto flex items-center gap-2.5 bg-surface-container-low/95 dark:bg-surface-container-low/90 backdrop-blur-xl px-4 py-1.5 rounded-full border border-outline-variant/30 shadow-[0_2px_12px_rgba(13,15,18,0.06)]">
          <button
            onClick={() => onSelectRole('landing')}
            className="flex items-center gap-2 font-headline-sm tracking-tight text-primary hover:opacity-90 transition-opacity cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed shadow-[0_0_8px_currentColor]"></span>
            <span className="font-bold tracking-tight text-sm sm:text-base">KRISHICLEAR</span>
          </button>
          <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-outline-variant/40">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed animate-pulse"></span>
            <span className="font-label-micro uppercase tracking-wider text-on-surface-variant font-semibold">
              HFT NETTING // T+0
            </span>
          </div>
        </div>

        {/* Right Navigation & Persona Status */}
        <div className="pointer-events-auto flex items-center gap-2 bg-surface-container-lowest/90 dark:bg-surface-container-lowest/85 backdrop-blur-2xl px-2.5 py-1.5 rounded-full border border-outline-variant/30 shadow-[0_4px_20px_rgba(13,15,18,0.08)]">
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
                <span>{activePersona?.name}</span>
                <span className="hidden sm:inline text-[11px] text-secondary-fixed font-normal">
                  ({activePersona?.title})
                </span>
                <ChevronDown className="w-3 h-3 text-outline" />
              </button>

              {/* Role Dropdown */}
              {isSwitcherOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/40 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95">
                  <div className="text-[10px] font-label-micro uppercase text-outline px-2 py-1 font-bold">
                    SWITCH ACTIVE DEMO PROFILE
                  </div>
                  <div className="space-y-1">
                    {(
                      Object.keys(PERSONA_LABELS) as UserRole[]
                    ).map((roleKey) => {
                      const item = PERSONA_LABELS[roleKey];
                      const IconComp = item.icon;
                      const isSelected = currentRole === roleKey;
                      return (
                        <button
                          key={roleKey}
                          onClick={() => {
                            onSelectRole(roleKey);
                            setIsSwitcherOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left text-xs transition-all ${
                            isSelected
                              ? 'bg-secondary-fixed/15 text-secondary-fixed font-bold'
                              : 'text-on-surface hover:bg-surface-container'
                          }`}
                        >
                          <div className="w-6 h-6 rounded-lg bg-surface-container flex items-center justify-center text-secondary-fixed">
                            <IconComp className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="font-bold">{item.name}</div>
                            <div className="text-[10px] text-on-surface-variant">
                              {item.title}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-t border-outline-variant/20 pt-1 mt-1">
                    <button
                      onClick={() => {
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
                onClick={() => onSelectRole('landing')}
                title="Log out back to Landing Page"
                className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 pl-1 border-l border-outline-variant/40">
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

