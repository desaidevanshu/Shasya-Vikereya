import React, { useState, useEffect } from 'react';
import { Navigation, Thermometer, Truck, Check, Play, Pause, FileText } from 'lucide-react';

interface TransitVectorModuleProps {
  onOpenGatePass?: () => void;
}

export const TransitVectorModule: React.FC<TransitVectorModuleProps> = ({ onOpenGatePass }) => {
  const [speed, setSpeed] = useState(64.2);
  const [temp, setTemp] = useState(13.8);
  const [progressKm, setProgressKm] = useState(74.2);
  const totalKm = 108.5;
  const [isSimulating, setIsSimulating] = useState(true);

  // Subtle live telemetry fluctuation
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setSpeed((prev) => +(prev + (Math.random() * 1.6 - 0.8)).toFixed(1));
      setTemp((prev) => +(13.8 + (Math.random() * 0.4 - 0.2)).toFixed(1));
      setProgressKm((prev) => {
        if (prev >= 108.0) return 74.2;
        return +(prev + 0.1).toFixed(1);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const progressPct = +((progressKm / totalKm) * 100).toFixed(1);

  return (
    <div className="bg-surface-container-low dark:bg-surface-container-low rounded-2xl p-4 sm:p-5 shadow-sm border border-outline-variant/30 my-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between pb-3 mb-3 gap-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <Navigation className="w-5 h-5 text-primary-container dark:text-secondary-fixed" />
          <span className="font-headline-sm text-sm sm:text-base md:text-lg text-primary uppercase font-bold tracking-tight">
            WESTERN MAHARASHTRA TRANSIT VECTOR // FLIGHT PATH NARAYANGAON → PUNE AGRI-HUB
          </span>
        </div>
        <div className="flex items-center gap-2 font-label-micro text-xs">
          <span className="px-2.5 py-1 rounded-md bg-surface-container dark:bg-surface-container-high text-on-surface font-label-numeric border border-outline-variant/20">
            CONVOY ID: MH-14-AZ-9904
          </span>
          <span className="px-2.5 py-1 rounded-md bg-primary-container dark:bg-secondary-fixed text-on-primary-container dark:text-on-secondary-fixed font-bold flex items-center gap-1">
            <Thermometer className="w-3.5 h-3.5" />
            REEFER TEMP: {temp}°C NOMINAL
          </span>
          {onOpenGatePass && (
            <button
              onClick={onOpenGatePass}
              className="px-2.5 py-1.5 rounded-md bg-secondary-fixed text-on-secondary-fixed font-bold text-[10px] flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Gate Pass
            </button>
          )}
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            title={isSimulating ? 'Pause Telemetry Simulation' : 'Resume Telemetry'}
            className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface-variant transition-colors"
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Vector Map Waypoint HUD Ribbon */}
      <div className="relative bg-surface-container-lowest dark:bg-surface-container-lowest p-3 sm:p-4 rounded-xl overflow-hidden border border-outline-variant/20">
        {/* 4 Waypoints */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 z-10 relative">
          {/* Gate 1 */}
          <div className="bg-surface-container-high/60 dark:bg-surface-container-high/40 backdrop-blur p-3.5 rounded-xl flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between text-outline font-label-micro text-[11px]">
              <span>WAYPOINT ALPHA</span>
              <span className="text-primary-container dark:text-secondary-fixed font-bold flex items-center gap-1">
                <Check className="w-3 h-3" />
                CLEARED
              </span>
            </div>
            <div className="font-headline-sm text-sm font-bold text-primary my-1.5">
              NARAYANGAON FPO HUB
            </div>
            <div className="font-label-micro text-xs text-on-surface-variant">
              LOAD: 14.5 MT ONION / 8.2 MT ANAR
            </div>
            <div className="mt-2 font-label-numeric text-xs text-secondary-fixed font-semibold">
              DEPART: 12:40:00 UTC
            </div>
          </div>

          {/* Gate 2 */}
          <div className="bg-surface-container-high/60 dark:bg-surface-container-high/40 backdrop-blur p-3.5 rounded-xl flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between text-outline font-label-micro text-[11px]">
              <span>TOLL GATE T-01</span>
              <span className="text-primary-container dark:text-secondary-fixed font-bold">
                FASTAG RFID VALIDATED
              </span>
            </div>
            <div className="font-headline-sm text-sm font-bold text-primary my-1.5">
              CHAKAN CORRIDOR GATEWAY
            </div>
            <div className="font-label-micro text-xs text-on-surface-variant">
              AUTO-CLEARANCE: 0.04s VIA NPCI NETC
            </div>
            <div className="mt-2 font-label-numeric text-xs text-primary-container dark:text-secondary-fixed font-semibold">
              ZERO TARE ANOMALY CONFIRMED
            </div>
          </div>

          {/* Gate 3 (Current Active Vector) */}
          <div className="bg-surface-container dark:bg-surface-container p-3.5 rounded-xl flex flex-col justify-between shadow-md border-2 border-secondary-fixed/80">
            <div className="flex items-center justify-between font-label-micro text-[11px]">
              <span className="text-secondary-fixed font-bold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 animate-bounce" />
                CURRENT VECTOR (IN-TRANSIT)
              </span>
              <span className="animate-ping w-2 h-2 rounded-full bg-secondary-fixed"></span>
            </div>
            <div className="font-headline-sm text-sm font-bold text-secondary-fixed my-1.5">
              MOSHI LOGISTICS JUNCTION
            </div>
            <div className="font-label-micro text-xs text-on-surface font-semibold">
              SPEED: {speed} KM/H // COMPASS: 184° S
            </div>
            <div className="mt-2 font-label-numeric text-xs text-primary dark:text-white font-bold">
              ETA DEST: 15:18:40 UTC (38 MIN)
            </div>
          </div>

          {/* Gate 4 */}
          <div className="bg-surface-container-high/60 dark:bg-surface-container-high/40 backdrop-blur p-3.5 rounded-xl flex flex-col justify-between border border-outline-variant/20">
            <div className="flex items-center justify-between text-outline font-label-micro text-[11px]">
              <span>DESTINATION TERMINAL</span>
              <span className="text-outline font-bold">AWAITING APPROACH</span>
            </div>
            <div className="font-headline-sm text-sm font-bold text-primary my-1.5">
              PUNE AGRI-CARGO AIR TERMINAL
            </div>
            <div className="font-label-micro text-xs text-on-surface-variant">
              AIR-FREIGHT BAY 04 / GULF AIR CARGO
            </div>
            <div className="mt-2 font-label-numeric text-xs text-outline">
              ESCROW RELEASE ON DOCK SCAN
            </div>
          </div>
        </div>

        {/* Telemetry Progress Gauge Track */}
        <div className="w-full bg-surface-container dark:bg-surface-container-high mt-4 h-2.5 rounded-full overflow-hidden flex">
          <div
            className="bg-primary-container dark:bg-secondary-fixed h-full transition-all duration-500"
            style={{ width: `${progressPct * 0.9}%` }}
          ></div>
          <div className="bg-secondary-fixed h-full w-2 animate-pulse"></div>
          <div className="bg-surface-container-highest flex-1 h-full"></div>
        </div>

        <div className="flex justify-between items-center text-on-surface-variant font-label-micro text-xs mt-2">
          <span>ORIGIN: KM 0.0</span>
          <span className="text-secondary-fixed font-bold font-label-numeric">
            PROGRESS: {progressPct}% (KM {progressKm} / {totalKm} KM)
          </span>
          <span>AIR TERMINAL: KM {totalKm}</span>
        </div>
      </div>
    </div>
  );
};
