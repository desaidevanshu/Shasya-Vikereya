import React from 'react';
import {
  Store,
  FileText,
  Users,
  ShieldCheck,
  TrendingUp,
  ThermometerSnowflake,
  Layers,
  ArrowRight,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { FpoDashboardView } from '../fpo-dashboard/FpoDashboardView.tsx';
import { OrderBoard } from '../marketplace/OrderBoard.tsx';

interface FpoProfileViewProps {
  onOpenGatePass: () => void;
  onOpenVoiceAssistant: () => void;
}

export const FpoProfileView: React.FC<FpoProfileViewProps> = ({
  onOpenGatePass,
  onOpenVoiceAssistant,
}) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* FPO Hero Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/40 dark:border-emerald-700/50">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                Sahyadri Farmers Agro FPO
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                FPO / Collective ✓
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-body-md mt-0.5">
              Dindori Road Aggregation &amp; Pre-cooling Hub, Nashik District | Registration #MH-NSK-FPO-4091
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-label-micro text-outline">
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-secondary-fixed" />
                450+ Smallholder Members
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-secondary-fixed" />
                85 MT Cold Hub (Pre-cooling Active)
              </span>
              <span>•</span>
              <span className="text-secondary-fixed font-bold">
                FASTag T-01 RFID Gate Pass Enabled
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={onOpenGatePass}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Generate Digital Gate Pass</span>
          </button>
        </div>
      </div>

      {/* Embedded Full FPO Command Dashboard */}
      <OrderBoard role="fpo" title="Open buyer requirements for FPO allocation" />
      <FpoDashboardView onOpenGatePass={onOpenGatePass} />
    </div>
  );
};
