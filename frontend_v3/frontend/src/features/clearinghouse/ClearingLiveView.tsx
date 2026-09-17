import React, { useState, useEffect } from 'react';
import { Cpu, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, RefreshCw, Layers } from 'lucide-react';
import { ClearingState, ClearingMatch } from '../../types.ts';
import { apiClient } from '../../api/client.ts';

export const ClearingLiveView: React.FC = () => {
  const [clearingState, setClearingState] = useState<ClearingState | null>(null);
  const [ambientTemp, setAmbientTemp] = useState(28);
  const [trafficDelay, setTrafficDelay] = useState(15);
  const [dieselPrice, setDieselPrice] = useState(94);
  const [isSolving, setIsSolving] = useState(false);
  const [reclearBanner, setReclearBanner] = useState<string | null>(null);

  useEffect(() => {
    loadClearingState();
  }, []);

  const loadClearingState = async () => {
    const state = await apiClient.getClearingState();
    setClearingState(state);
  };

  const handleSolve = async () => {
    setIsSolving(true);
    setReclearBanner(null);
    try {
      const res = await apiClient.solveClearing({
        ambientTempC: ambientTemp,
        trafficDelayPct: trafficDelay,
        dieselPrice,
      });
      if (clearingState) {
        setClearingState({
          ...clearingState,
          matches: res.matches,
        });
      }
    } finally {
      setIsSolving(false);
    }
  };

  const handleSimulateDropout = async () => {
    setIsSolving(true);
    try {
      const res = await apiClient.reclearMarket('LOT-JNR-108');
      setReclearBanner(res.message);
      await loadClearingState();
    } finally {
      setIsSolving(false);
    }
  };

  if (!clearingState) return null;

  return (
    <div className="space-y-6">
      {/* Top Banner with Stats */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-outline-variant/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="w-5 h-5 text-secondary-fixed animate-pulse" />
              <span className="font-headline-sm text-lg sm:text-xl font-bold text-primary">
                CLEARINGHOUSE ENGINE // MULTI-COMMODITY NETTING MATRIX
              </span>
            </div>
            <p className="font-body-md text-sm text-on-surface-variant">
              High-frequency bilateral clearing algorithm pair-matching 42 FPO supply aggregations with institutional buyers, eliminating mandi middlemen and securing T+0 escrow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleSolve}
              disabled={isSolving}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary font-label-lg font-bold text-xs flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSolving ? 'animate-spin' : ''}`} />
              <span>RUN CLEARING SOLVER</span>
            </button>

            <button
              onClick={handleSimulateDropout}
              disabled={isSolving}
              className="px-4 py-2 rounded-xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest font-label-lg font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-secondary-fixed" />
              <span>SIMULATE DROPOUT &amp; RE-CLEAR</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-surface-container dark:bg-surface-container p-4 rounded-xl border border-outline-variant/20">
            <div className="text-outline text-xs font-label-micro uppercase">ACTIVE FPO POOLS</div>
            <div className="font-headline-sm text-2xl font-bold text-primary mt-1">
              {clearingState.totalPools} Pools
            </div>
            <div className="text-[11px] font-label-micro text-secondary-fixed mt-1 font-semibold">
              {clearingState.activeFarmers.toLocaleString()} Registered Farmers
            </div>
          </div>

          <div className="bg-surface-container dark:bg-surface-container p-4 rounded-xl border border-outline-variant/20">
            <div className="text-outline text-xs font-label-micro uppercase">CLEARED PRODUCE VOLUME</div>
            <div className="font-headline-sm text-2xl font-bold text-secondary-fixed mt-1">
              {clearingState.clearedVolumeMT.toFixed(1)} MT
            </div>
            <div className="text-[11px] font-label-micro text-on-surface-variant mt-1">
              Out of {clearingState.totalVolumeMT.toFixed(1)} MT Capacity
            </div>
          </div>

          <div className="bg-surface-container dark:bg-surface-container p-4 rounded-xl border border-outline-variant/20">
            <div className="text-outline text-xs font-label-micro uppercase">MATCHING SPEED</div>
            <div className="font-headline-sm text-2xl font-bold text-primary mt-1">
              {clearingState.avgClearingSpeedMs} µs
            </div>
            <div className="text-[11px] font-label-micro text-secondary-fixed mt-1 font-semibold">
              Sub-millisecond T+0 Netting
            </div>
          </div>

          <div className="bg-surface-container dark:bg-surface-container p-4 rounded-xl border border-outline-variant/20">
            <div className="text-outline text-xs font-label-micro uppercase">MIDDLEMAN COMMISSION ELIMINATED</div>
            <div className="font-headline-sm text-2xl font-bold text-secondary-fixed mt-1">
              ₹{clearingState.netSavedRupees.toLocaleString()}
            </div>
            <div className="text-[11px] font-label-micro text-on-surface-variant mt-1">
              Retained in Farmer Accounts
            </div>
          </div>
        </div>
      </div>

      {/* Reclear Alert Toast */}
      {reclearBanner && (
        <div className="p-4 bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
          <ShieldCheck className="w-5 h-5 text-secondary-fixed shrink-0" />
          <div className="text-xs font-body-md text-on-surface">
            <span className="font-bold text-secondary-fixed">Algorithmic Resiliency Verified: </span>
            {reclearBanner}
          </div>
        </div>
      )}

      {/* Environmental Stress Parameters Bar */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-outline" />
          <span className="font-label-micro font-bold text-xs uppercase text-primary">
            Solver Constraints &amp; Real-Time Weights
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs font-label-micro">
          <div className="flex items-center gap-2">
            <span className="text-outline">Ambient Temp:</span>
            <input
              type="range"
              min="15"
              max="45"
              value={ambientTemp}
              onChange={(e) => setAmbientTemp(+e.target.value)}
              className="w-24 accent-secondary-fixed cursor-pointer"
            />
            <span className="font-label-numeric font-bold text-primary">{ambientTemp}°C</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-outline">Traffic Delay:</span>
            <input
              type="range"
              min="0"
              max="60"
              value={trafficDelay}
              onChange={(e) => setTrafficDelay(+e.target.value)}
              className="w-24 accent-secondary-fixed cursor-pointer"
            />
            <span className="font-label-numeric font-bold text-primary">{trafficDelay}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-outline">Diesel Price:</span>
            <input
              type="range"
              min="85"
              max="115"
              value={dieselPrice}
              onChange={(e) => setDieselPrice(+e.target.value)}
              className="w-24 accent-secondary-fixed cursor-pointer"
            />
            <span className="font-label-numeric font-bold text-primary">₹{dieselPrice}/L</span>
          </div>
        </div>
      </div>

      {/* Clearing Matches Ledger */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center justify-between mb-4">
          <div className="font-headline-sm text-base font-bold text-primary">
            Active Bilateral Clearing Contracts
          </div>
          <span className="font-label-micro text-xs text-outline">
            {clearingState.matches.length} Settled Pairs
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clearingState.matches.map((m) => (
            <div
              key={m.id}
              className="bg-surface-container-lowest dark:bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/20 hover:border-secondary-fixed/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 text-xs font-label-micro">
                  <span className="font-label-numeric font-bold text-secondary-fixed">{m.fpoRef}</span>
                  <span className="px-2 py-0.5 rounded bg-primary-container/15 text-primary-container dark:text-secondary-fixed font-bold">
                    {m.escrowStatus}
                  </span>
                </div>

                <div className="my-2.5">
                  <div className="font-headline-sm text-base font-bold text-primary">
                    {m.commodity}
                  </div>
                  <div className="text-xs text-on-surface-variant mt-0.5">
                    {m.volumeKg.toLocaleString()} KG @ Cleared Price: <span className="font-bold text-secondary-fixed">₹{m.clearedPricePerKg.toFixed(2)}/kg</span> (Farm Gate Ask: ₹{m.farmGateAsk.toFixed(2)})
                  </div>
                </div>

                <div className="text-xs font-label-micro space-y-1 text-on-surface-variant bg-surface-container p-2.5 rounded-lg border border-outline-variant/15">
                  <div className="flex items-center gap-1">
                    <span className="text-outline">Origin:</span>
                    <span className="text-primary font-medium">{m.transitOrigin}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-outline">Destination:</span>
                    <span className="text-primary font-medium">{m.transitDestination}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-outline-variant/15 mt-3 text-xs font-label-micro">
                <span className="text-outline">Matched at: {m.matchTimestamp}</span>
                <span className="font-label-numeric font-bold text-secondary-fixed">
                  +₹{m.spreadNetSaved.toLocaleString()} Commission Eliminated
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
