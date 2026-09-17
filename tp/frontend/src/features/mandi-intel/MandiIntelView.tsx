import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, TrendingDown, ArrowUpRight, BarChart3, Sparkles, Filter } from 'lucide-react';
import type { MandiRecord, CommodityPriceCorridor } from '../../types.ts';
import { apiClient } from '../../api/client.ts';
import { COMMODITY_CORRIDORS } from '../../data/mockData.ts';

export const MandiIntelView: React.FC = () => {
  const [records, setRecords] = useState<MandiRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('Red Onion');
  const [corridor, setCorridor] = useState<CommodityPriceCorridor>(COMMODITY_CORRIDORS['Red Onion']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedCommodity]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const results = await apiClient.searchMandis(searchQuery, undefined, selectedCommodity === 'All' ? undefined : selectedCommodity);
      setRecords(results);
      const corr = await apiClient.getMandiCorridor(selectedCommodity === 'All' ? 'Red Onion' : selectedCommodity);
      setCorridor(corr);
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  };

  const commodities = ['Red Onion', 'Pomegranate', 'Tomato', 'Thompson Grapes'];

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-secondary-fixed" />
            <span className="font-headline-sm text-lg sm:text-xl font-bold text-primary">
              MANDI INTELLIGENCE &amp; AI PRICE CORRIDORS
            </span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant">
            Cross-APMC wholesale telemetry across Maharashtra mandis paired with 72-hour algorithmic forward clearing predictions.
          </p>
        </div>

        {/* Commodity Switcher Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-surface-container-lowest dark:bg-surface-container-lowest p-1.5 rounded-full border border-outline-variant/20">
          {commodities.map((crop) => (
            <button
              key={crop}
              onClick={() => setSelectedCommodity(crop)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-label-lg transition-all ${
                selectedCommodity === crop
                  ? 'bg-primary text-on-primary font-bold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              }`}
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* AI Forward Corridor Graph & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-8 bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <div className="text-xs font-label-micro text-outline uppercase tracking-wider">
                72-HOUR PRICE TRAJECTORY FORECAST
              </div>
              <div className="font-headline-sm text-lg font-bold text-primary flex items-center gap-2 mt-0.5">
                <span>{corridor.commodity} Wholesale Corridor</span>
                <span className="px-2 py-0.5 text-[11px] rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  +27.3% NET CLEARANCE GAIN
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs font-label-micro">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-secondary-fixed inline-block"></span>
                <span>KrishiClear Cleared</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-outline inline-block border-dashed border-b"></span>
                <span>APMC Modal Avg</span>
              </div>
            </div>
          </div>

          {/* SVG Visualizing Corridor & Forecast */}
          <div className="w-full h-56 relative bg-surface-container-lowest dark:bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/20 flex items-end">
            <div className="w-full h-full flex flex-col justify-between">
              {/* Grid lines */}
              <div className="border-b border-outline-variant/15 w-full flex justify-between text-[10px] text-outline">
                <span>₹{(corridor.historicalRange.max * 1.1).toFixed(0)}/kg</span>
                <span>UPPER CONFIDENCE BOUND</span>
              </div>
              <div className="border-b border-outline-variant/15 w-full flex justify-between text-[10px] text-outline">
                <span>₹{((corridor.historicalRange.max + corridor.historicalRange.min) / 2).toFixed(0)}/kg</span>
                <span>MEAN RESIDUAL</span>
              </div>
              <div className="border-b border-outline-variant/15 w-full flex justify-between text-[10px] text-outline">
                <span>₹{(corridor.historicalRange.min * 0.9).toFixed(0)}/kg</span>
                <span>LOWER CARTEL FLOOR</span>
              </div>

              {/* Data points columns */}
              <div className="grid grid-cols-7 gap-2 pt-2 h-36 items-end">
                {corridor.forecastDays.map((pt, idx) => {
                  const maxVal = corridor.historicalRange.max * 1.15;
                  const heightPct = Math.min(100, Math.max(15, (pt.expectedPrice / maxVal) * 100));
                  const isToday = pt.day === 'Today';

                  return (
                    <div key={idx} className="flex flex-col items-center h-full justify-end group">
                      {/* Tooltip on hover */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-primary text-on-primary text-[10px] font-label-numeric py-1 px-1.5 rounded mb-1 whitespace-nowrap shadow-lg z-10 pointer-events-none">
                        ₹{pt.expectedPrice.toFixed(1)} ({pt.demandVolumeMT} MT)
                      </div>

                      {/* Bar / Column */}
                      <div
                        className={`w-full max-w-[28px] rounded-t-lg transition-all relative ${
                          isToday
                            ? 'bg-secondary-fixed shadow-[0_0_12px_rgba(0,245,155,0.4)]'
                            : pt.day.startsWith('D+')
                            ? 'bg-primary-container/80 dark:bg-primary-container/60'
                            : 'bg-surface-container-highest dark:bg-surface-container-high'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      >
                        {isToday && (
                          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-secondary-fixed animate-ping"></div>
                        )}
                      </div>

                      <span className={`text-[10px] font-label-micro mt-2 ${isToday ? 'font-bold text-secondary-fixed' : 'text-outline'}`}>
                        {pt.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-label-micro text-on-surface-variant pt-3 border-t border-outline-variant/15 mt-3">
            <span>Model: AgriCast-XGBoost-Ensemble-v4</span>
            <span className="font-label-numeric font-bold text-secondary-fixed">
              Real-Time Spread Advantage: +₹{(corridor.krishiClearClearedPrice - corridor.currentMandiAvg).toFixed(2)}/kg
            </span>
          </div>
        </div>

        {/* Arbitrage & Spread Breakdown Card */}
        <div className="lg:col-span-4 bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="text-xs font-label-micro text-outline uppercase tracking-wider mb-1">
              MIDDLEMAN DISINTERMEDIATION SPREAD
            </div>
            <div className="font-headline-sm text-lg font-bold text-primary mb-4">
              Where The Farmer&apos;s Yield Goes
            </div>

            <div className="space-y-3 font-label-micro text-xs">
              <div className="p-3 rounded-xl bg-surface-container dark:bg-surface-container border border-outline-variant/20">
                <div className="flex justify-between text-outline">
                  <span>TRADITIONAL APMC RECOVERY:</span>
                  <span className="font-label-numeric font-bold text-primary">₹{corridor.currentMandiAvg.toFixed(2)} /kg</span>
                </div>
                <div className="text-[11px] text-error mt-1">
                  -8.5% Commission Broker Fee
                  <br />
                  -4.2% Uncalibrated Tare Weight Theft
                  <br />
                  -4.8% Spoilage Delay at Mandi Gate
                </div>
              </div>

              <div className="p-3 rounded-xl bg-secondary-fixed/10 border border-secondary-fixed/30">
                <div className="flex justify-between text-secondary-fixed">
                  <span className="font-bold">KRISHICLEAR CLEARED:</span>
                  <span className="font-label-numeric font-bold text-base">₹{corridor.krishiClearClearedPrice.toFixed(2)} /kg</span>
                </div>
                <div className="text-[11px] text-on-surface-variant mt-1">
                  ✓ 0% Middleman Deduction
                  <br />
                  ✓ 100% Calibrated Axle Weighment
                  <br />
                  ✓ T+0 High-Ticket UPI Settlement
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-surface-container-lowest dark:bg-surface-container-lowest rounded-xl border border-outline-variant/20 mt-4 text-center">
            <div className="text-xs text-outline font-label-micro">NET FARMER VALUE LIFT</div>
            <div className="font-headline-sm text-2xl font-bold text-secondary-fixed mt-0.5">
              +23.4%
            </div>
          </div>
        </div>
      </div>

      {/* Live Mandi Search & Table */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
          <div>
            <div className="font-headline-sm text-base font-bold text-primary">
              Live Mandi Ticker across Western Maharashtra
            </div>
            <div className="text-xs font-label-micro text-outline">
              APMC Arrivals, Modal Pricing, and Daily Velocity
            </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search mandi, district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-surface-container-lowest dark:bg-surface-container-lowest border border-outline-variant/30 text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary-fixed"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-label-micro border-collapse min-w-[640px]">
            <thead>
              <tr className="text-outline border-b border-outline-variant/20 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-medium">MANDI NAME</th>
                <th className="pb-3 font-medium">LOCATION</th>
                <th className="pb-3 font-medium">COMMODITY &amp; VARIETY</th>
                <th className="pb-3 font-medium text-right">ARRIVAL (MT)</th>
                <th className="pb-3 font-medium text-right">MODAL PRICE</th>
                <th className="pb-3 font-medium text-right">PRICE RANGE</th>
                <th className="pb-3 font-medium text-center">TREND</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs">
              {records.map((record) => (
                <tr key={record.id} className="hover:bg-surface-container/60 transition-colors">
                  <td className="py-3 font-body-md font-bold text-primary">
                    {record.name}
                  </td>
                  <td className="py-3 text-on-surface-variant font-body-md">
                    {record.district}, {record.state}
                  </td>
                  <td className="py-3 font-body-md">
                    <span className="font-semibold text-primary">{record.commodity}</span>
                    <span className="text-outline text-[11px] block">{record.variety}</span>
                  </td>
                  <td className="py-3 font-label-numeric text-right text-on-surface font-semibold">
                    {record.arrivalVolumeMT.toLocaleString()} MT
                  </td>
                  <td className="py-3 font-label-numeric font-bold text-secondary-fixed text-right text-sm">
                    ₹{record.modalPrice.toFixed(2)}/kg
                  </td>
                  <td className="py-3 font-label-numeric text-outline text-right text-[11px]">
                    ₹{record.minPrice.toFixed(2)} - ₹{record.maxPrice.toFixed(2)}
                  </td>
                  <td className="py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        record.trend === 'up'
                          ? 'bg-secondary-fixed/15 text-secondary-fixed'
                          : record.trend === 'down'
                          ? 'bg-error/15 text-error'
                          : 'bg-surface-container text-outline'
                      }`}
                    >
                      {record.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                      {record.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                      {record.trendPct > 0 ? `+${record.trendPct}%` : `${record.trendPct}%`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
