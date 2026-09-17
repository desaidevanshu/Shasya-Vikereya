import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-surface-container-low dark:bg-surface-container-low text-on-surface-variant pt-12 pb-8 border-t border-outline-variant/30 mt-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          <div className="md:col-span-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 font-headline-sm text-lg text-primary tracking-tight">
                <span className="w-3 h-3 rounded-full bg-primary-container shadow-[0_0_8px_currentColor]"></span>
                <span className="font-bold">KRISHICLEAR TELEMETRY</span>
              </div>
              <p className="font-body-md text-sm text-on-surface-variant max-w-sm leading-relaxed">
                Aerospace telemetry and high-frequency settlement protocol bridging Western Maharashtra agricultural hubs, FPO cold-chains, and air-cargo logistics.
              </p>
            </div>
            <div className="mt-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container border border-outline-variant/30 font-label-numeric text-xs text-on-surface">
                <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></span>
                GRID TICKER: 19.0760° N, 72.8777° E — MAHARASHTRA AGRI-HUB MESH
              </span>
            </div>
          </div>

          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div className="space-y-3">
              <span className="font-label-micro uppercase tracking-wider text-on-surface font-bold text-xs">
                Protocol Artifacts
              </span>
              <ul className="space-y-2 font-body-md text-xs sm:text-sm">
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Vol. 01 Bone Print</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">NIR Chromatics 04</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Kinetic Reefer Units</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Tare Sensor Calibration</li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="font-label-micro uppercase tracking-wider text-on-surface font-bold text-xs">
                Network &amp; Mandis
              </span>
              <ul className="space-y-2 font-body-md text-xs sm:text-sm">
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Solapur Anar Cluster</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Nashik Onion Hub</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Junnar Polyhouse Mesh</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Baramati Table Grapes</li>
              </ul>
            </div>
            <div className="space-y-3">
              <span className="font-label-micro uppercase tracking-wider text-on-surface font-bold text-xs">
                System Rails
              </span>
              <ul className="space-y-2 font-body-md text-xs sm:text-sm">
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">NPCI IMPS-UPI Rails</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">FASTag RFID T-01 Gates</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Merkle Proof Root</li>
                <li className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">RBI Escrow Vault #9941</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-outline-variant/20 flex flex-col sm:flex-row items-center justify-between gap-3 font-label-micro text-xs text-on-surface-variant">
          <div className="flex items-center gap-4">
            <span>© 2026 KRISHICLEAR PROTOCOL INC.</span>
            <span className="hidden md:inline text-outline">•</span>
            <span className="hidden md:inline">AEROSPACE TELEMETRY SPEC. 9.4</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold tracking-wider text-[11px] shadow-sm">
              DISPATCH AVAILABLE
            </span>
            <span className="font-label-numeric">STATION ID: KCL-ALPHA-09</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
