import React from 'react';
import {
  Truck,
  FileText,
  ThermometerSnowflake,
  Radio,
  ShieldCheck,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Zap,
} from 'lucide-react';
import { LogisticsRouteView } from '../logistics/LogisticsRouteView.tsx';
import { OrderBoard } from '../marketplace/OrderBoard.tsx';
import { RouteGisView } from '../../components/RouteGisView.tsx';
import type { Language } from '../../translations.ts';

interface TransporterProfileViewProps {
  onOpenGatePass: () => void;
  lang?: Language;
}

export const TransporterProfileView: React.FC<TransporterProfileViewProps> = ({
  onOpenGatePass,
  lang = 'en',
}) => {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Transporter Hero Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/40 dark:border-emerald-700/50">
            <Truck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                KisanLogistics Fleet (Sachin Shinde)
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Transporter / Fleet ✓
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-body-md mt-0.5">
              Active Reefer Convoy: MH-14-AZ-9904 | Operating Base: Chakan Logistics Hub, Pune
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-label-micro text-outline">
              <span className="flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5 text-secondary-fixed" />
                GPS Telemetry: 62 km/h • On-Time
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-secondary-fixed" />
                Active Reefer: 13.8°C (Target 14°C)
              </span>
              <span>•</span>
              <span className="text-secondary-fixed font-bold">
                FASTag T-01 Corridor Automated
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onOpenGatePass}
          className="px-4 py-2.5 rounded-2xl bg-secondary-fixed text-on-secondary-fixed font-bold text-xs flex items-center justify-center gap-2 hover:opacity-95 transition-opacity cursor-pointer shadow-sm"
        >
          <FileText className="w-4 h-4" />
          <span>Vehicle Inspection Pass</span>
        </button>
      </div>

      {/* Embedded Logistics & Route Comparison Engine */}
      <OrderBoard role="transporter" title="Paid orders ready for smart-route dispatch" />
      <RouteGisView lang={lang} onOpenGatePass={onOpenGatePass} />
      <LogisticsRouteView onOpenGatePass={onOpenGatePass} />
    </div>
  );
};
