import React, { useState } from 'react';
import {
  Shield,
  Radio,
  Sliders,
  Play,
  Cpu,
  RefreshCw,
  Zap,
  Activity,
  AlertTriangle,
  FileText,
  Lock,
} from 'lucide-react';
import { SystemTicker } from '../../components/flight-deck/SystemTicker.tsx';
import { RadarChokeModule } from '../../components/flight-deck/RadarChokeModule.tsx';
import { CropDiagnosticsModule } from '../../components/flight-deck/CropDiagnosticsModule.tsx';
import { TransitVectorModule } from '../../components/flight-deck/TransitVectorModule.tsx';
import { OrderbookSolverModule } from '../../components/flight-deck/OrderbookSolverModule.tsx';
import { UpiDisbursalConsole } from '../../components/flight-deck/UpiDisbursalConsole.tsx';
import { MissionLogBar } from '../../components/flight-deck/MissionLogBar.tsx';
import { SimulationStudioView } from '../simulation-studio/SimulationStudioView.tsx';

interface PlatformProfileViewProps {
  onOpenGatePass: () => void;
  onOpenVoiceAssistant: () => void;
}

export const PlatformProfileView: React.FC<PlatformProfileViewProps> = ({
  onOpenGatePass,
  onOpenVoiceAssistant,
}) => {
  const [activeSubView, setActiveSubView] = useState<'flight-deck' | 'simulation'>('flight-deck');

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      {/* Platform Admin Hero Banner */}
      <div className="bg-surface-container-low dark:bg-surface-container-low rounded-3xl p-6 border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-300/40 dark:border-emerald-700/50">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline-sm text-2xl font-bold text-primary">
                Platform Operations Admin
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                Platform Operations ✓
              </span>
            </div>
            <p className="text-xs text-on-surface-variant font-body-md mt-0.5">
              Agri-Tech Directorate Mission Control, Pune | Clearinghouse Master Node #HFT-CLEAR-01
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-label-micro text-outline">
              <span className="flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-secondary-fixed" />
                Solvers Active: 18 µs Cycle
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-secondary-fixed" />
                Deficit / Surplus Surveillance: NOMINAL
              </span>
              <span>•</span>
              <span className="text-secondary-fixed font-bold">
                Escrow Multi-Sig Vault: ARMED
              </span>
            </div>
          </div>
        </div>

        {/* View Switcher: Mission HUD vs Simulation */}
        <div className="flex items-center gap-2 bg-surface-container dark:bg-surface-container p-1 rounded-2xl border border-outline-variant/30">
          <button
            onClick={() => setActiveSubView('flight-deck')}
            className={`px-4 py-2 rounded-xl text-xs font-label-lg font-bold transition-all ${
              activeSubView === 'flight-deck'
                ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Mission HUD Flight Deck
          </button>
          <button
            onClick={() => setActiveSubView('simulation')}
            className={`px-4 py-2 rounded-xl text-xs font-label-lg font-bold transition-all ${
              activeSubView === 'simulation'
                ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Digital Twin Simulation
          </button>
        </div>
      </div>

      {activeSubView === 'flight-deck' ? (
        <div className="space-y-6">
          <SystemTicker />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5">
              <RadarChokeModule />
            </div>
            <div className="lg:col-span-7">
              <CropDiagnosticsModule />
            </div>
          </div>
          <TransitVectorModule onOpenGatePass={onOpenGatePass} />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6">
              <OrderbookSolverModule />
            </div>
            <div className="lg:col-span-6">
              <UpiDisbursalConsole />
            </div>
          </div>
          <MissionLogBar />
        </div>
      ) : (
        <SimulationStudioView />
      )}
    </div>
  );
};
