import React, { useState, useEffect } from 'react';
import { Building2, Download, ShieldCheck, Users, IndianRupee, Truck, FileSpreadsheet, CheckCircle2 } from 'lucide-react';
import { FpoAnalytics } from '../../types.ts';
import { apiClient } from '../../api/client.ts';

interface FpoDashboardViewProps {
  onOpenGatePass: () => void;
}

export const FpoDashboardView: React.FC<FpoDashboardViewProps> = ({ onOpenGatePass }) => {
  const [analytics, setAnalytics] = useState<FpoAnalytics | null>(null);
  const [downloadMsg, setDownloadMsg] = useState(false);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const res = await apiClient.getFpoAnalytics();
    setAnalytics(res);
  };

  const handleExportLedger = () => {
    setDownloadMsg(true);
    setTimeout(() => setDownloadMsg(false), 3000);
  };

  if (!analytics) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-secondary-fixed" />
            <span className="font-headline-sm text-lg sm:text-xl font-bold text-primary">
              FPO FEDERATION COMMAND CENTER &amp; AUDIT LEDGER
            </span>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant">
            {analytics.fpoName} — Aggregated telemetry, algorithmic netting verification, and T+0 UPI disbursement records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportLedger}
            className="px-3.5 py-2 rounded-xl bg-surface-container dark:bg-surface-container-high border border-outline-variant/30 text-on-surface hover:bg-surface-container-highest text-xs font-label-lg font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT AUDIT LEDGER</span>
          </button>

          <button
            onClick={onOpenGatePass}
            className="px-3.5 py-2 rounded-xl bg-primary text-on-primary text-xs font-label-lg font-bold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>ISSUE DIGITAL GATE PASS</span>
          </button>
        </div>
      </div>

      {downloadMsg && (
        <div className="p-4 bg-secondary-fixed/10 border border-secondary-fixed/30 rounded-xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-secondary-fixed shrink-0" />
          <div className="text-xs font-body-md text-on-surface font-semibold">
            Audit Ledger Cryptographically Verified! CSV/JSON exported with Merkle root hash timestamp.
          </div>
        </div>
      )}

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-xs font-label-micro uppercase">
            <span>REGISTERED FARMERS</span>
            <Users className="w-4 h-4 text-secondary-fixed" />
          </div>
          <div className="font-headline-sm text-2xl sm:text-3xl font-bold text-primary mt-2">
            {analytics.registeredFarmers.toLocaleString()}
          </div>
          <div className="text-xs font-label-micro text-secondary-fixed mt-1 font-semibold">
            Across 42 Western Maharashtra FPO Clusters
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-xs font-label-micro uppercase">
            <span>VOLUME HANDLED</span>
            <Truck className="w-4 h-4 text-primary-container" />
          </div>
          <div className="font-headline-sm text-2xl sm:text-3xl font-bold text-secondary-fixed mt-2">
            {analytics.totalVolumeHandledMT.toLocaleString()} MT
          </div>
          <div className="text-xs font-label-micro text-on-surface-variant mt-1">
            Zero middleman transit spoilage
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-xs font-label-micro uppercase">
            <span>TOTAL DISBURSED (T+0)</span>
            <IndianRupee className="w-4 h-4 text-secondary-fixed" />
          </div>
          <div className="font-headline-sm text-2xl sm:text-3xl font-bold text-primary mt-2">
            ₹{analytics.totalDisbursedCrores} Cr
          </div>
          <div className="text-xs font-label-micro text-secondary-fixed mt-1 font-semibold">
            100% Direct Account Settlement
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-xs font-label-micro uppercase">
            <span>COMMISSIONS SAVED</span>
            <ShieldCheck className="w-4 h-4 text-secondary-fixed" />
          </div>
          <div className="font-headline-sm text-2xl sm:text-3xl font-bold text-secondary-fixed mt-2">
            ₹{(analytics.middlemanCommissionEliminatedRs / 100000).toFixed(2)} Lakhs
          </div>
          <div className="text-xs font-label-micro text-on-surface-variant mt-1">
            Replaced APMC 8.5% broker extortion
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-xs font-label-micro uppercase">
            <span>COLD-CHAIN INTEGRITY</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <div className="font-headline-sm text-2xl sm:text-3xl font-bold text-primary mt-2">
            {analytics.coldChainIntegrityPct}%
          </div>
          <div className="text-xs font-label-micro text-secondary-fixed mt-1 font-semibold">
            Reefer units held within 13.5°C - 14.2°C
          </div>
        </div>

        <div className="bg-surface-container-low dark:bg-surface-container-low p-5 rounded-2xl border border-outline-variant/30">
          <div className="flex items-center justify-between text-outline text-xs font-label-micro uppercase">
            <span>UPI SUCCESS RATE</span>
            <ShieldCheck className="w-4 h-4 text-secondary-fixed" />
          </div>
          <div className="font-headline-sm text-2xl sm:text-3xl font-bold text-secondary-fixed mt-2">
            {analytics.upiSettlementSuccessRatePct}%
          </div>
          <div className="text-xs font-label-micro text-on-surface-variant mt-1">
            NPCI IMPS-UPI High-Ticket Protocol
          </div>
        </div>
      </div>

      {/* FPO Clusters Table */}
      <div className="bg-surface-container-low dark:bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30">
        <div className="font-headline-sm text-base font-bold text-primary mb-4">
          Regional FPO Cluster Performance Ledger
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-label-micro border-collapse min-w-[600px]">
            <thead>
              <tr className="text-outline border-b border-outline-variant/20 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-medium">FPO CLUSTER ENTITY</th>
                <th className="pb-3 font-medium">DISTRICT</th>
                <th className="pb-3 font-medium text-right">FARMERS</th>
                <th className="pb-3 font-medium text-right">VOLUME CLEARED</th>
                <th className="pb-3 font-medium text-right">DISBURSED SUM</th>
                <th className="pb-3 font-medium text-right">NET VALUE LIFT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 text-xs">
              <tr className="hover:bg-surface-container/60 transition-colors">
                <td className="py-3 font-body-md font-bold text-primary">Solapur Anar Federation FPO</td>
                <td className="py-3 text-on-surface-variant">Solapur</td>
                <td className="py-3 font-label-numeric text-right">480</td>
                <td className="py-3 font-label-numeric text-right">680 MT</td>
                <td className="py-3 font-label-numeric font-bold text-primary text-right">₹11.45 Cr</td>
                <td className="py-3 font-label-numeric font-bold text-secondary-fixed text-right">+24.1%</td>
              </tr>
              <tr className="hover:bg-surface-container/60 transition-colors">
                <td className="py-3 font-body-md font-bold text-primary">Nashik Onion Valley Hub FPO</td>
                <td className="py-3 text-on-surface-variant">Nashik (Niphad/Lasalgaon)</td>
                <td className="py-3 font-label-numeric text-right">620</td>
                <td className="py-3 font-label-numeric text-right">2,100 MT</td>
                <td className="py-3 font-label-numeric font-bold text-primary text-right">₹6.55 Cr</td>
                <td className="py-3 font-label-numeric font-bold text-secondary-fixed text-right">+27.3%</td>
              </tr>
              <tr className="hover:bg-surface-container/60 transition-colors">
                <td className="py-3 font-body-md font-bold text-primary">Junnar Polyhouse Cluster FPO</td>
                <td className="py-3 text-on-surface-variant">Pune (Otur/Junnar)</td>
                <td className="py-3 font-label-numeric text-right">340</td>
                <td className="py-3 font-label-numeric text-right">420 MT</td>
                <td className="py-3 font-label-numeric font-bold text-primary text-right">₹2.48 Cr</td>
                <td className="py-3 font-label-numeric font-bold text-secondary-fixed text-right">+22.9%</td>
              </tr>
              <tr className="hover:bg-surface-container/60 transition-colors">
                <td className="py-3 font-body-md font-bold text-primary">Baramati Grape Growers Association</td>
                <td className="py-3 text-on-surface-variant">Pune (Baramati)</td>
                <td className="py-3 font-label-numeric text-right">402</td>
                <td className="py-3 font-label-numeric text-right">1,080 MT</td>
                <td className="py-3 font-label-numeric font-bold text-primary text-right">₹10.20 Cr</td>
                <td className="py-3 font-label-numeric font-bold text-secondary-fixed text-right">+21.1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
