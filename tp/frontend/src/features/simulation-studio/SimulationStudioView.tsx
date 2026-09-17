import React, { useState, useEffect } from 'react';
import { Sliders, Activity, ShieldCheck, ThermometerSnowflake, Flame, Clock, Fuel } from 'lucide-react';
import type { SimulationParams, SimulationResult } from '../../types.ts';
import { apiClient } from '../../api/client.ts';

export const SimulationStudioView: React.FC = () => {
  const [params, setParams] = useState<SimulationParams>({
    scenarioName: 'Summer Heatwave Spike (+6°C)',
    ambientTempC: 34,
    trafficDelayPct: 15,
    dieselPriceDeltaRs: 0,
    temperatureSpikeC: 6,
  });

  const [result, setResult] = useState<SimulationResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    runSim();
  }, [params]);

  const runSim = async () => {
    setIsRunning(true);
    try {
      const res = await apiClient.runSimulation(params);
      setResult(res);
    } finally {
      setIsRunning(false);
    }
  };

  const setScenarioPreset = (
    name: string,
    temp: number,
    delay: number,
    diesel: number,
    spike: number
  ) => {
    setParams({
      scenarioName: name,
      ambientTempC: temp,
      trafficDelayPct: delay,
      dieselPriceDeltaRs: diesel,
      temperatureSpikeC: spike,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-5 h-5 text-secondary-fixed" />
          <span className="font-headline-sm text-lg sm:text-xl font-bold text-primary">
            DIGITAL TWIN SIMULATION STUDIO // LOGISTICS STRESS TEST
          </span>
        </div>
        <p className="font-body-md text-sm text-on-surface-variant">
          Simulate environmental heatwaves, highway chokepoints, fuel price shocks, and cartel lockouts to test algorithmic routing resilience against traditional APMC middleman supply chains.
        </p>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <button
            onClick={() => setScenarioPreset('Summer Heatwave Spike (+6°C)', 36, 10, 0, 6)}
            className={`px-3 py-1.5 rounded-full text-xs font-label-lg transition-all flex items-center gap-1.5 ${
              params.scenarioName.includes('Heatwave')
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Heatwave Spike (+6°C)</span>
          </button>

          <button
            onClick={() => setScenarioPreset('Monsoon Highway Chokepoint (40% Delay)', 28, 40, 2, 1)}
            className={`px-3 py-1.5 rounded-full text-xs font-label-lg transition-all flex items-center gap-1.5 ${
              params.scenarioName.includes('Chokepoint')
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Highway Chokepoint (40% Delay)</span>
          </button>

          <button
            onClick={() => setScenarioPreset('Diesel Price Shock (+₹15/L)', 30, 15, 15, 0)}
            className={`px-3 py-1.5 rounded-full text-xs font-label-lg transition-all flex items-center gap-1.5 ${
              params.scenarioName.includes('Diesel')
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <Fuel className="w-3.5 h-3.5 text-yellow-400" />
            <span>Fuel Shock (+₹15/L)</span>
          </button>

          <button
            onClick={() => setScenarioPreset('Middleman APMC Cartel Strike', 32, 20, 0, 2)}
            className={`px-3 py-1.5 rounded-full text-xs font-label-lg transition-all flex items-center gap-1.5 ${
              params.scenarioName.includes('Cartel')
                ? 'bg-primary text-on-primary font-bold shadow-sm'
                : 'bg-surface-container text-on-surface hover:bg-surface-container-high'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-secondary-fixed" />
            <span>APMC Cartel Strike (Direct Bypass)</span>
          </button>
        </div>
      </div>

      {/* Control Sliders & Live Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders Panel */}
        <div className="lg:col-span-4 bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 space-y-5">
          <div className="font-headline-sm text-base font-bold text-primary">
            Stress Test Parameters
          </div>

          <div className="space-y-4 font-label-micro text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-outline">AMBIENT TEMPERATURE:</span>
                <span className="font-label-numeric font-bold text-primary">{params.ambientTempC}°C</span>
              </div>
              <input
                type="range"
                min="18"
                max="48"
                value={params.ambientTempC}
                onChange={(e) => setParams({ ...params, ambientTempC: +e.target.value })}
                className="w-full accent-secondary-fixed cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-outline">MICRO-CLIMATE HEAT SPIKE:</span>
                <span className="font-label-numeric font-bold text-orange-400">+{params.temperatureSpikeC}°C</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={params.temperatureSpikeC}
                onChange={(e) => setParams({ ...params, temperatureSpikeC: +e.target.value })}
                className="w-full accent-orange-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-outline">TRANSIT HIGHWAY CONGESTION:</span>
                <span className="font-label-numeric font-bold text-primary">{params.trafficDelayPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={params.trafficDelayPct}
                onChange={(e) => setParams({ ...params, trafficDelayPct: +e.target.value })}
                className="w-full accent-secondary-fixed cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="text-outline">DIESEL FUEL SURCHARGE DELTA:</span>
                <span className="font-label-numeric font-bold text-primary">+₹{params.dieselPriceDeltaRs}/L</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={params.dieselPriceDeltaRs}
                onChange={(e) => setParams({ ...params, dieselPriceDeltaRs: +e.target.value })}
                className="w-full accent-secondary-fixed cursor-pointer"
              />
            </div>
          </div>

          <div className="p-3 bg-surface-container dark:bg-surface-container rounded-xl border border-outline-variant/20 text-xs font-label-micro">
            <div className="text-outline">ACTIVE DIGITAL SCENARIO:</div>
            <div className="font-bold text-primary mt-0.5">{params.scenarioName}</div>
          </div>
        </div>

        {/* Live Comparison Cards */}
        {result && (
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Direct Cold-Chain Bypass Card */}
              <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border-2 border-secondary-fixed/80 shadow-md flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 text-xs font-label-micro">
                    <span className="font-bold text-secondary-fixed flex items-center gap-1">
                      <ThermometerSnowflake className="w-3.5 h-3.5" />
                      KRISHICLEAR DIRECT BYPASS
                    </span>
                    <span className="px-2 py-0.5 rounded bg-secondary-fixed/15 text-secondary-fixed font-bold">
                      REACTIVE LOGISTICS
                    </span>
                  </div>

                  <div className="my-4 space-y-3 font-label-micro text-xs">
                    <div className="flex justify-between">
                      <span className="text-outline">TOTAL FREIGHT &amp; TRANSIT COST:</span>
                      <span className="font-label-numeric font-bold text-primary">₹{result.directBypassCost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-outline">TRANSIT SPOILAGE RATE:</span>
                      <span className="font-label-numeric font-bold text-secondary-fixed">{result.spoilageRateDirectPct}%</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-outline">TRANSIT DURATION:</span>
                      <span className="font-label-numeric font-semibold text-on-surface">{result.transitDurationHours} Hours</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-outline">NET FARMER REALIZATION:</span>
                      <span className="font-label-numeric font-bold text-secondary-fixed text-sm">+{result.farmerNetRealizationDeltaPct}% LIFT</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-secondary-fixed/10 rounded-xl border border-secondary-fixed/20 text-xs font-body-md text-secondary-fixed">
                  ✓ Pre-cooled reefer containers isolate produce from outside heat spike.
                </div>
              </div>

              {/* Traditional APMC Cartel Card */}
              <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-error/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-outline-variant/15 text-xs font-label-micro">
                    <span className="font-bold text-error">TRADITIONAL APMC MANDI ROUTE</span>
                    <span className="px-2 py-0.5 rounded bg-error/15 text-error font-bold">
                      HIGH VULNERABILITY
                    </span>
                  </div>

                  <div className="my-4 space-y-3 font-label-micro text-xs">
                    <div className="flex justify-between">
                      <span className="text-outline">TOTAL FREIGHT &amp; DALAAL FEES:</span>
                      <span className="font-label-numeric font-bold text-primary">₹{result.traditionalApmcCost.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-outline">TRANSIT &amp; YARD SPOILAGE:</span>
                      <span className="font-label-numeric font-bold text-error">{result.spoilageRateApmcPct}% LOSS</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-outline">TRANSIT + YARD WAIT DURATION:</span>
                      <span className="font-label-numeric font-semibold text-on-surface">{(result.transitDurationHours + 4.2).toFixed(1)} Hours</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-outline">TARE WEIGHT PENALTY:</span>
                      <span className="font-label-numeric font-bold text-error">-4.2% Uncalibrated Scale</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-error/10 rounded-xl border border-error/20 text-xs font-body-md text-error">
                  ⚠ Unrefrigerated open trucks in traffic delay cause rot and decay.
                </div>
              </div>
            </div>

            {/* AI Recommendation Banner */}
            <div className="p-4 bg-surface-container-lowest dark:bg-surface-container-lowest rounded-2xl border border-outline-variant/30 flex items-center gap-3">
              <Activity className="w-5 h-5 text-secondary-fixed shrink-0" />
              <div className="text-xs font-body-md">
                <span className="font-bold text-primary">Simulation Tactical Directive: </span>
                <span className="text-on-surface-variant">{result.recommendedAction}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
