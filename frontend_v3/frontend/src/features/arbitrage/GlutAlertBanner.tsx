import React, { useState } from 'react';
import { AlertOctagon, ArrowRight, ShieldCheck, X } from 'lucide-react';

export const GlutAlertBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isDiverted, setIsDiverted] = useState(false);

  if (!isVisible) return null;

  return (
    <div className="mb-4 bg-error-container dark:bg-surface-container-high border border-error/40 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-2.5">
        <AlertOctagon className="w-5 h-5 text-error shrink-0 animate-pulse" />
        <div className="text-xs">
          <span className="font-label-numeric font-bold text-error uppercase">
            GLUT DISTRESS SIGNAL:
          </span>{' '}
          <span className="text-on-surface font-body-md font-medium">
            +34% Arrival surge at Lasalgaon APMC causing predatory broker down-marking (-₹6.50/kg).
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
        {isDiverted ? (
          <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-micro font-bold text-xs flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            CONVOY REROUTED TO PUNE CARGO BAY 04 (+₹1,47,400 SAVED)
          </span>
        ) : (
          <button
            onClick={() => setIsDiverted(true)}
            className="px-3 py-1.5 rounded-lg bg-error text-white font-label-micro font-bold text-xs flex items-center gap-1 hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
          >
            <span>TRIGGER AIR-CARGO DIVERSION</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-full text-on-surface-variant hover:text-on-surface"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
