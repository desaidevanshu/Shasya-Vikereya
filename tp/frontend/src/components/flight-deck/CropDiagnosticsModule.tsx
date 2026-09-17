import React, { useState } from 'react';
import { Dna, Sparkles, CheckCheck } from 'lucide-react';

export const CropDiagnosticsModule: React.FC = () => {
  const [activeSpec, setActiveSpec] = useState<'A' | 'B'>('A');

  return (
    <div className="flex flex-col bg-surface-container-low dark:bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 gap-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Dna className="w-5 h-5 text-secondary-fixed animate-spin" style={{ animationDuration: '12s' }} />
          <span className="font-headline-sm text-sm sm:text-base text-primary uppercase font-bold tracking-tight">
            MULTI-SPECTRAL CROP DIAGNOSTICS // OPTICAL NIR-SCOPE
          </span>
        </div>
        <div className="flex items-center gap-2 font-label-micro text-xs">
          <span className="px-2.5 py-1 rounded-full bg-primary text-on-primary font-bold text-[10px]">
            BAND: 780nm-1050nm
          </span>
          <span className="px-2.5 py-1 rounded-full bg-surface-container-highest dark:bg-surface-container-high text-secondary-fixed font-bold text-[10px]">
            TARGET: EXPORT SPEC
          </span>
        </div>
      </div>

      {/* Spectrogram Grid (A and B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
        {/* Spectrogram A: Solapur Bhagwa Pomegranate */}
        <div
          onClick={() => setActiveSpec('A')}
          className={`cursor-pointer transition-all bg-surface-container-lowest dark:bg-surface-container-lowest p-3 rounded-xl border flex flex-col justify-between ${
            activeSpec === 'A'
              ? 'border-primary-container ring-1 ring-primary-container shadow-md'
              : 'border-outline-variant/20 hover:border-outline-variant/50'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-label-numeric text-xs font-bold text-secondary-fixed flex items-center gap-1">
              SPEC-A: SOLAPUR BHAGWA ANAR
            </span>
            <span className="font-label-micro text-[11px] text-primary-container font-semibold bg-primary-container/10 px-2 py-0.5 rounded">
              BRIX: 16.8° [PRIME]
            </span>
          </div>

          {/* Waveform SVG */}
          <div className="my-1">
            <svg className="w-full h-20" preserveAspectRatio="none" viewBox="0 0 240 80">
              <defs>
                <linearGradient id="gradPome" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#00F0FF" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,60 Q30,10 60,35 T120,20 T180,50 T240,15 L240,80 L0,80 Z"
                fill="url(#gradPome)"
              />
              <path
                className="text-primary-container dark:text-secondary-fixed"
                d="M0,60 Q30,10 60,35 T120,20 T180,50 T240,15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              {/* Marker pin */}
              <circle cx="120" cy="20" r="3.5" fill="currentColor" className="text-secondary-fixed" />
              <text x="125" y="24" fill="currentColor" className="text-secondary-fixed font-label-micro text-[8.5px] font-bold">
                ARIL DENSITY 94%
              </text>
            </svg>
          </div>

          <div className="flex justify-between text-on-surface-variant font-label-micro text-[11px] pt-1 border-t border-outline-variant/15">
            <span className="text-primary font-medium">ANTHOCYANIN: PEAK</span>
            <span>MOISTURE LOSS: 0.12%/HR</span>
          </div>
        </div>

        {/* Spectrogram B: Nashik Red Onion Pyruvic Profile */}
        <div
          onClick={() => setActiveSpec('B')}
          className={`cursor-pointer transition-all bg-surface-container-lowest dark:bg-surface-container-lowest p-3 rounded-xl border flex flex-col justify-between ${
            activeSpec === 'B'
              ? 'border-secondary-fixed ring-1 ring-secondary-fixed shadow-md'
              : 'border-outline-variant/20 hover:border-outline-variant/50'
          }`}
        >
          <div className="flex justify-between items-center mb-1">
            <span className="font-label-numeric text-xs font-bold text-tertiary-fixed flex items-center gap-1">
              SPEC-B: NASHIK RED RABI BULB
            </span>
            <span className="font-label-micro text-[11px] text-secondary-fixed font-semibold bg-secondary-fixed/10 px-2 py-0.5 rounded">
              PYRUVATE: 7.2 µmol/g
            </span>
          </div>

          {/* Waveform SVG */}
          <div className="my-1">
            <svg className="w-full h-20" preserveAspectRatio="none" viewBox="0 0 240 80">
              <defs>
                <linearGradient id="gradOnion" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#FF9E00" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#FF9E00" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0,70 Q40,30 80,45 T160,15 T210,35 T240,25 L240,80 L0,80 Z"
                fill="url(#gradOnion)"
              />
              <path
                className="text-secondary-fixed dark:text-secondary-fixed"
                d="M0,70 Q40,30 80,45 T160,15 T210,35 T240,25"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              />
              <circle cx="160" cy="15" r="3.5" fill="currentColor" className="text-primary dark:text-white" />
              <text x="165" y="18" fill="currentColor" className="text-primary dark:text-white font-label-micro text-[8.5px] font-bold">
                SHELF LIFE: 42 DAYS
              </text>
            </svg>
          </div>

          <div className="flex justify-between text-on-surface-variant font-label-micro text-[11px] pt-1 border-t border-outline-variant/15">
            <span className="text-primary font-medium">DRY MATTER: 14.8%</span>
            <span>SPOILAGE RISK: &lt;0.01%</span>
          </div>
        </div>
      </div>

      {/* Telemetry Diagnostic Feeds (4 Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-label-micro text-xs mt-auto">
        <div className="bg-surface-container dark:bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
          <div className="text-outline text-[10px] uppercase font-medium">CURING UNIFORMITY</div>
          <div className="font-label-numeric text-primary font-bold text-xs mt-0.5 flex items-center gap-1">
            <CheckCheck className="w-3.5 h-3.5 text-secondary-fixed" />
            99.1% STABLE
          </div>
        </div>

        <div className="bg-surface-container dark:bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
          <div className="text-outline text-[10px] uppercase font-medium">SPECTRAL RESOLUTION</div>
          <div className="font-label-numeric text-primary-container dark:text-secondary-fixed font-bold text-xs mt-0.5">
            0.4nm / PIXEL
          </div>
        </div>

        <div className="bg-surface-container dark:bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
          <div className="text-outline text-[10px] uppercase font-medium">ETHYLENE OUTGAS</div>
          <div className="font-label-numeric text-secondary-fixed font-bold text-xs mt-0.5 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            0.03 PPM [SAFE]
          </div>
        </div>

        <div className="bg-surface-container dark:bg-surface-container p-2.5 rounded-lg border border-outline-variant/20">
          <div className="text-outline text-[10px] uppercase font-medium">EXPORT GRADING CLASS</div>
          <div className="font-label-numeric text-primary font-bold text-xs mt-0.5 truncate">
            EURO-GAP GRADE AAA
          </div>
        </div>
      </div>
    </div>
  );
};
