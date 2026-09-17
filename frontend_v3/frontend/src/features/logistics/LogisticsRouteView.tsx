import React, { useState, useEffect } from 'react';
import { Route, Truck, ShieldAlert, CheckCircle, Scale, Clock, Fuel, ArrowRight } from 'lucide-react';
import { RouteComparison } from '../../types.ts';
import { apiClient } from '../../api/client.ts';

export const LogisticsRouteView: React.FC = () => {
  const [data, setData] = useState<{
    directRoute: RouteComparison;
    traditionalRoute: RouteComparison;
    savingsRupees: number;
    timeSavedHours: number;
  } | null>(null);

  useEffect(() => {
    loadRoute();
  }, []);

  const loadRoute = async () => {
    const res = await apiClient.compareRoutes({ quantityKg: 14500 });
    setData(res);
  };

  if (!data) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Route className="w-5 h-5 text-secondary-fixed" />
            <span className="font-headline-sm text-lg sm:text-xl font-bold text-primary">
              LOGISTICS ROUTE ANALYSIS &amp; TARE DEDUCTION AUDIT
            </span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant">
            Forensic comparison of direct algorithmic cold-chain dispatch vs traditional APMC middleman supply chain for 14.5 MT produce consignments.
          </p>
        </div>

        <div className="bg-secondary-fixed/15 border border-secondary-fixed/40 px-4 py-2.5 rounded-xl text-right">
          <div className="text-xs font-label-micro text-secondary-fixed font-bold uppercase">NET FARMER BENEFIT</div>
          <div className="font-headline-sm text-xl font-bold text-secondary-fixed">
            +₹{data.savingsRupees.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Direct Algorithmic Route Card */}
        <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border-2 border-secondary-fixed/80 shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 text-xs font-label-micro">
              <span className="font-bold text-secondary-fixed flex items-center gap-1.5 text-sm">
                <Truck className="w-4 h-4" />
                SHASYA VIKREYA DIRECT COLD-CHAIN VECTOR
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed/20 text-secondary-fixed font-bold">
                SAFETY SCORE: {data.directRoute.safetyScore}%
              </span>
            </div>

            <div className="my-5 space-y-3.5 font-label-micro text-xs">
              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-secondary-fixed" />
                  TRANSIT DURATION &amp; DISTANCE:
                </span>
                <span className="font-label-numeric font-bold text-primary">
                  {data.directRoute.durationHours} hrs ({data.directRoute.distanceKm} km)
                </span>
              </div>

              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-secondary-fixed" />
                  TARE WEIGHT DEDUCTION:
                </span>
                <span className="font-label-numeric font-bold text-secondary-fixed">
                  0 KG (100% Axle Validated)
                </span>
              </div>

              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline">TRANSIT SPOILAGE LOSS:</span>
                <span className="font-label-numeric font-bold text-secondary-fixed">
                  {data.directRoute.transitSpoilagePct}% (Reefer Controlled)
                </span>
              </div>

              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline">MIDDLEMAN COMMISSION BROKER FEE:</span>
                <span className="font-label-numeric font-bold text-secondary-fixed">
                  ₹0 (FASTag Toll: ₹{data.directRoute.tollAndMiddlemanFee})
                </span>
              </div>

              <div className="flex justify-between items-center bg-secondary-fixed/15 p-3.5 rounded-xl border border-secondary-fixed/30 text-sm">
                <span className="font-bold text-secondary-fixed">NET FARMER PAYOUT:</span>
                <span className="font-label-numeric font-bold text-secondary-fixed text-base">
                  ₹{data.directRoute.netFarmerPayout.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container text-xs text-on-surface-variant font-body-md">
            ✓ Narayangaon FPO → Chakan T-01 → Moshi Corridor → Pune Airport Bay 04. No uncalibrated stopover weighment.
          </div>
        </div>

        {/* Traditional APMC Route Card */}
        <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-error/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 text-xs font-label-micro">
              <span className="font-bold text-error flex items-center gap-1.5 text-sm">
                <ShieldAlert className="w-4 h-4" />
                TRADITIONAL APMC MANDI ROUTE
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-error/15 text-error font-bold">
                SAFETY SCORE: {data.traditionalRoute.safetyScore}%
              </span>
            </div>

            <div className="my-5 space-y-3.5 font-label-micro text-xs">
              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-error" />
                  TRANSIT + MANDI YARD DELAY:
                </span>
                <span className="font-label-numeric font-bold text-primary">
                  {data.traditionalRoute.durationHours} hrs ({data.traditionalRoute.distanceKm} km)
                </span>
              </div>

              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline flex items-center gap-1.5">
                  <Scale className="w-4 h-4 text-error" />
                  TARE WEIGHT DEDUCTION:
                </span>
                <span className="font-label-numeric font-bold text-error">
                  -{data.traditionalRoute.tareWeightDeductionKg} KG (4.2% Scale Skimming)
                </span>
              </div>

              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline">TRANSIT &amp; YARD SPOILAGE LOSS:</span>
                <span className="font-label-numeric font-bold text-error">
                  {data.traditionalRoute.transitSpoilagePct}% Rot / Heat Damage
                </span>
              </div>

              <div className="flex justify-between items-center bg-surface-container dark:bg-surface-container p-3 rounded-xl border border-outline-variant/15">
                <span className="text-outline">BROKER COMMISSIONS &amp; LEVIES:</span>
                <span className="font-label-numeric font-bold text-error">
                  -₹{data.traditionalRoute.tollAndMiddlemanFee.toLocaleString()} (8.5% Commission)
                </span>
              </div>

              <div className="flex justify-between items-center bg-error/15 p-3.5 rounded-xl border border-error/30 text-sm">
                <span className="font-bold text-error">NET FARMER PAYOUT:</span>
                <span className="font-label-numeric font-bold text-error text-base">
                  ₹{data.traditionalRoute.netFarmerPayout.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-surface-container text-xs text-error font-body-md">
            ⚠ Multiple unloadings, commission agents, informal kickbacks, and open truck exposure in summer sun.
          </div>
        </div>
      </div>
    </div>
  );
};
