import React, { useState } from 'react';
import { Radar, ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { HOSTILE_JAMMING_TARGETS } from '../../data/mockData.ts';

export const RadarChokeModule: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<(typeof HOSTILE_JAMMING_TARGETS)[0] | null>(null);

  return (
    <div className="flex flex-col bg-surface-container-low dark:bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 relative overflow-hidden h-full">
      {/* Module Header */}
      <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Radar className="w-5 h-5 text-primary-container dark:text-secondary-fixed animate-pulse" />
          <span className="font-headline-sm text-sm sm:text-base text-primary uppercase font-bold tracking-tight">
            RADAR: CHOKE INTERCEPT
          </span>
        </div>
        <span className="font-label-micro text-[11px] px-2.5 py-0.5 rounded-full bg-surface-container-highest dark:bg-surface-container-high text-secondary dark:text-secondary-fixed font-bold">
          POLAR 12NM
        </span>
      </div>

      {/* Circular Radar Scanning Display */}
      <div className="relative w-full aspect-square flex items-center justify-center bg-surface-container-lowest dark:bg-surface-container-lowest rounded-xl overflow-hidden my-2 border border-outline-variant/20">
        <svg className="w-full h-full p-2 select-none" viewBox="0 0 300 300">
          {/* Background grid concentric circles */}
          <circle
            cx="150"
            cy="150"
            r="140"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-surface-container-highest dark:text-surface-container-high opacity-70"
          />
          <circle
            cx="150"
            cy="150"
            r="100"
            fill="none"
            stroke="currentColor"
            strokeDasharray="4,4"
            strokeWidth="1"
            className="text-surface-container-high dark:text-surface-container-highest opacity-70"
          />
          <circle
            cx="150"
            cy="150"
            r="60"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-surface-container-highest dark:text-surface-container-high opacity-70"
          />
          <circle
            cx="150"
            cy="150"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-primary-container dark:text-secondary-fixed opacity-40"
          />

          {/* Coordinate crosshairs */}
          <line
            x1="10"
            y1="150"
            x2="290"
            y2="150"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-surface-container-high dark:text-surface-container-highest opacity-60"
          />
          <line
            x1="150"
            y1="10"
            x2="150"
            y2="290"
            stroke="currentColor"
            strokeWidth="0.8"
            className="text-surface-container-high dark:text-surface-container-highest opacity-60"
          />

          {/* Dynamic Sweeper Beam */}
          <g className="origin-center animate-[spin_4s_linear_infinite]" style={{ transformOrigin: '150px 150px' }}>
            <polygon
              points="150,150 290,150 280,110"
              fill="currentColor"
              className="text-primary-container dark:text-secondary-fixed opacity-20"
            />
            <line
              x1="150"
              y1="150"
              x2="290"
              y2="150"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary-container dark:text-secondary-fixed opacity-90"
            />
          </g>

          {/* Hostile Middleman Tare Jamming Targets */}
          {/* Target 1: Vashi Cartel Hub */}
          <g className="cursor-pointer group" onClick={() => setSelectedTarget(HOSTILE_JAMMING_TARGETS[0])}>
            <circle cx="95" cy="80" r="6" fill="currentColor" className="text-error animate-ping opacity-75" />
            <circle cx="95" cy="80" r="4" fill="currentColor" className="text-error group-hover:scale-125 transition-transform" />
            <text x="105" y="85" fill="currentColor" className="text-error font-label-micro text-[9px] font-bold">
              JAM-01: VASHI APMC (-4.2% TARE)
            </text>
          </g>

          {/* Target 2: Baramati Weighbridge */}
          <g className="cursor-pointer group" onClick={() => setSelectedTarget(HOSTILE_JAMMING_TARGETS[1])}>
            <circle cx="210" cy="95" r="4" fill="currentColor" className="text-error group-hover:scale-125 transition-transform" />
            <text x="140" y="115" fill="currentColor" className="text-error font-label-micro text-[9px] font-bold">
              JAM-02: BRM-WEIGH [-2.8% DRIFT]
            </text>
          </g>

          {/* Target 3: Pune Market Broker Node */}
          <g className="cursor-pointer group" onClick={() => setSelectedTarget(HOSTILE_JAMMING_TARGETS[2])}>
            <circle cx="230" cy="190" r="4" fill="currentColor" className="text-error group-hover:scale-125 transition-transform" />
            <text x="155" y="210" fill="currentColor" className="text-error font-label-micro text-[9px] font-bold">
              JAM-03: PUNE-INTERCEPT [LOCKED]
            </text>
          </g>

          {/* Target 4: Junnar Commission Broker */}
          <g className="cursor-pointer group" onClick={() => setSelectedTarget(HOSTILE_JAMMING_TARGETS[3])}>
            <circle cx="75" cy="200" r="4" fill="currentColor" className="text-error group-hover:scale-125 transition-transform" />
            <text x="15" y="215" fill="currentColor" className="text-error font-label-micro text-[9px] font-bold">
              JAM-04: JNR-COMM
            </text>
          </g>

          {/* Target 5: Indapur Silo Toll Extortion */}
          <g className="cursor-pointer group" onClick={() => setSelectedTarget(HOSTILE_JAMMING_TARGETS[4])}>
            <circle cx="160" cy="245" r="5" fill="currentColor" className="text-error animate-pulse" />
            <text x="120" y="260" fill="currentColor" className="text-error font-label-micro text-[9px] font-bold">
              JAM-05: SILO LEAK [DEFUSED]
            </text>
          </g>

          {/* Friendly Fleet Vector: Central Triangle */}
          <polygon
            points="150,143 156,155 144,155"
            fill="currentColor"
            className="text-primary-container dark:text-secondary-fixed shadow-md"
          />
        </svg>
      </div>

      {/* Target Details Overlay Modal */}
      {selectedTarget && (
        <div className="absolute inset-4 bg-surface-container-lowest/95 dark:bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-4 z-20 border border-error/40 flex flex-col justify-between shadow-2xl animate-in fade-in zoom-in-95 duration-150">
          <div>
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-error" />
                <span className="font-label-numeric font-bold text-xs text-error">
                  {selectedTarget.id}: {selectedTarget.name}
                </span>
              </div>
              <button
                onClick={() => setSelectedTarget(null)}
                className="p-1 rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between font-label-numeric">
                <span className="text-outline">TARE DRIFT PENALTY:</span>
                <span className="text-error font-bold">{selectedTarget.tareDrift}</span>
              </div>
              <div className="flex justify-between font-label-numeric">
                <span className="text-outline">INTERCEPT POSTURE:</span>
                <span className="text-primary-container font-bold">{selectedTarget.threatLevel}</span>
              </div>
              <p className="text-on-surface-variant mt-2 leading-relaxed bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
                {selectedTarget.description}
              </p>
            </div>
          </div>
          <div className="pt-2">
            <div className="flex items-center gap-1.5 text-secondary dark:text-secondary-fixed text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Algorithmic Direct Bypass Active — Neutralized</span>
            </div>
          </div>
        </div>
      )}

      {/* Telemetry Metrics */}
      <div className="mt-auto space-y-1.5 font-label-micro text-xs">
        <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20">
          <span className="text-outline font-medium">DECOUPLING EFFICIENCY:</span>
          <span className="text-primary-container dark:text-secondary-fixed font-label-numeric font-bold">
            98.4% BYPASS ACTIVE
          </span>
        </div>
        <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20">
          <span className="text-outline font-medium">INTERCEPTED DRIFT VOL:</span>
          <span className="text-secondary dark:text-secondary-fixed font-label-numeric font-semibold">
            18.42 MT PRESERVED
          </span>
        </div>
      </div>
    </div>
  );
};
