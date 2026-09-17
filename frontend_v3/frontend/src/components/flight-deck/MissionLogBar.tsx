import React from 'react';
import { Plane, Lock, ShieldCheck, TrendingUp } from 'lucide-react';

export const MissionLogBar: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-surface-container-lowest dark:bg-surface-container-lowest p-3 rounded-xl border border-outline-variant/30 text-xs font-label-micro shadow-sm mt-4">
      <div className="flex items-center gap-2 text-on-surface-variant">
        <Plane className="w-4 h-4 text-primary" />
        <div>
          <div className="text-outline text-[10px] uppercase">AIR TERMINAL BAY</div>
          <div className="font-label-numeric font-bold text-primary">CARGO-BAY 04 [GULF AIR]</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-on-surface-variant">
        <div className="w-2.5 h-2.5 rounded-full bg-secondary-fixed animate-pulse"></div>
        <div>
          <div className="text-outline text-[10px] uppercase">REEFER COMPRESSOR</div>
          <div className="font-label-numeric font-bold text-primary">RUNNING (13.8°C NOMINAL)</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-on-surface-variant">
        <TrendingUp className="w-4 h-4 text-secondary-fixed" />
        <div>
          <div className="text-outline text-[10px] uppercase">DISINTERMEDIATION NET</div>
          <div className="font-label-numeric font-bold text-secondary-fixed">+23.4% VALUE RECOVERY</div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-on-surface-variant">
        <Lock className="w-4 h-4 text-primary" />
        <div>
          <div className="text-outline text-[10px] uppercase">PROTOCOL SECURITY</div>
          <div className="font-label-numeric font-bold text-primary">ECC-SECP256K1 AUTH</div>
        </div>
      </div>
    </div>
  );
};
