import React, { useState, useEffect } from 'react';

export const SystemTicker: React.FC = () => {
  const [clock, setClock] = useState('12:29:01.288');

  useEffect(() => {
    let animationFrameId: number;
    const updateTime = () => {
      const now = new Date();
      const hrs = String(now.getUTCHours()).padStart(2, '0');
      const mins = String(now.getUTCMinutes()).padStart(2, '0');
      const secs = String(now.getUTCSeconds()).padStart(2, '0');
      const ms = String(now.getUTCMilliseconds()).padStart(3, '0');
      setClock(`${hrs}:${mins}:${secs}.${ms}`);
      animationFrameId = requestAnimationFrame(updateTime);
    };
    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2.5 bg-surface-container-lowest dark:bg-surface-container-lowest/90 p-3 sm:p-4 rounded-xl mb-4 shadow-sm border border-outline-variant/30">
      {/* Left: Status & Headline */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0 bg-primary/5 dark:bg-primary-container/10 px-2.5 py-1 rounded-full border border-primary/20">
          <span className="w-2.5 h-2.5 rounded-full bg-primary-container dark:bg-secondary-fixed animate-ping"></span>
          <span className="font-label-micro uppercase tracking-widest text-primary dark:text-primary-container font-bold text-[10px]">
            ORBITAL-LINK ACTIVE
          </span>
        </div>
        <span className="font-headline-sm text-xs sm:text-sm md:text-base text-primary uppercase tracking-tight truncate font-bold">
          SYSTEM FLIGHT DECK: KRISHI-HUD v9.4 // SAT-LINK ESTABLISHED
        </span>
      </div>

      {/* Right: Telemetry Chips */}
      <div className="flex flex-wrap items-center gap-2 font-label-micro text-on-surface-variant shrink-0">
        {/* UTC Clock */}
        <div className="flex items-center gap-1.5 bg-surface-container dark:bg-surface-container-high px-2.5 py-1 rounded-md border border-outline-variant/20">
          <span className="text-secondary-fixed font-bold text-[10px]">UTC:</span>
          <span className="text-on-surface font-label-numeric font-semibold text-xs tracking-tight" id="hud-clock">
            {clock}
          </span>
        </div>

        {/* Sig.Int */}
        <div className="flex items-center gap-1.5 bg-surface-container dark:bg-surface-container-high px-2.5 py-1 rounded-md border border-outline-variant/20">
          <span className="text-secondary-fixed font-bold text-[10px]">SIG.INT:</span>
          <span className="text-primary-container dark:text-secondary-fixed font-label-numeric font-semibold text-xs">
            99.98% [NOMINAL]
          </span>
        </div>

        {/* Merkle Root */}
        <div className="hidden lg:flex items-center gap-1.5 bg-surface-container dark:bg-surface-container-high px-2.5 py-1 rounded-md border border-outline-variant/20">
          <span className="text-outline font-bold text-[10px]">MERKLE:</span>
          <span className="text-on-surface font-label-numeric text-xs">
            0x8F9A...41C7_ROOT
          </span>
        </div>

        {/* Coordinates */}
        <div className="flex items-center gap-2 bg-surface-container dark:bg-surface-container-high px-2.5 py-1 rounded-md border border-outline-variant/20 text-primary dark:text-primary font-label-numeric text-xs">
          <span>LAT 19.0760 N</span>
          <span>LNG 72.8777 E</span>
        </div>
      </div>
    </div>
  );
};
